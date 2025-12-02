import prisma from "../prisma";
import logger from "../utils/logger";

export async function handleChargeSuccess(data: any) {
  const reference = data.reference;

  const transaction = await prisma.transaction.findFirst({
    where: { providerTransactionId: reference }, //finding the tansaction
  });

  if (!transaction) {
    logger.error(`Transaction not found for reference: ${reference}`);
    return;
  }

  ////If it was already completed then skip
  if (transaction.status === "COMPLETED") {
    return;
  }

  // Process enrollment
  await prisma.$transaction(async (tx) => {
    ////Update transaction
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "COMPLETED",
        metadata: {
          ...(transaction.metadata as any),
          webhookData: data,
          completedAt: new Date().toISOString(),
        },
      },
    });

    /////Check if enrolment already exists for the user
    const existingEnrollment = await tx.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: transaction.userId,
          courseId: transaction.courseId!,
        },
      },
    });

    if (!existingEnrollment) {
      ////if not create it
      await tx.enrollment.create({
        data: {
          userId: transaction.userId,
          courseId: transaction.courseId!,
          pricePaid: transaction.amount,
          currency: transaction.currency,
          status: "ACTIVE",
        },
      });

      ////Update the course enrollment count
      await tx.course.update({
        where: { id: transaction.courseId! },
        data: {
          enrollmentCount: { increment: 1 },
        },
      });

      /////Remove from wishlist
      await tx.wishlist.deleteMany({
        where: {
          userId: transaction.userId,
          courseId: transaction.courseId!,
        },
      });
    }
  });

  logger.info(`Enrollment completed for transaction: ${transaction.id}`);
}

export async function handleChargeFailed(data: any) {
  const reference = data.reference;

  const transaction = await prisma.transaction.findFirst({
    where: { providerTransactionId: reference },
  });

  if (!transaction) {
    return;
  }

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: "FAILED",
      metadata: {
        ...(transaction.metadata as any),
        webhookData: data,
        failedAt: new Date().toISOString(),
      },
    },
  });

  logger.error(`Transaction failed: ${transaction.id}`);
}

export async function handleRefundProcessed(data: any) {
  const reference = data.transaction_reference;

  const transaction = await prisma.transaction.findFirst({
    where: { providerTransactionId: reference },
  });

  if (!transaction) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    ////Update the transaction status
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "REFUNDED",
        metadata: {
          ...(transaction.metadata as any),
          refundData: data,
          refundedAt: new Date().toISOString(),
        },
      },
    });

    /////Update the enrollment status
    await tx.enrollment.updateMany({
      where: {
        userId: transaction.userId,
        courseId: transaction.courseId!,
      },
      data: {
        status: "REFUNDED",
      },
    });

    /////Decrement the enrollment count
    await tx.course.update({
      where: { id: transaction.courseId! },
      data: {
        enrollmentCount: { decrement: 1 },
      },
    });
  });

  logger.warn(`Refund processed for transaction: ${transaction.id}`);
}
