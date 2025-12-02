import { Request, Response } from "express";
import prisma from "../prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { ApiError } from "../utils/error";
import { PaystackService } from "../services/paystackService";
import {
  handleChargeFailed,
  handleChargeSuccess,
  handleRefundProcessed,
} from "../middleware/paymentWebhook";
import logger from "../utils/logger";
import crypto from "crypto";

const paystackService = PaystackService();

///INITIALIZE PAYMENT FOR A COURSE
export const initializePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { courseId } = req.body;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw ApiError.notFound(
        "User not found, Make sure you're logged in to purchase"
      );
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        discountPrice: true,
        currency: true,
        isPublished: true,
      },
    });

    if (!course) {
      throw ApiError.notFound(
        "Course not found, Try purchasing an existing course"
      );
    }

    if (!course.isPublished) {
      throw ApiError.badRequest(
        "This course is not available for enrollment, Please check back later"
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw ApiError.badRequest(
        "You are already enrolled in this course, You can't purchase a course twice"
      );
    }

    /////Calc the amount, use discount if available
    const amount = course.discountPrice || course.price;

    /////Convert to kobo
    const amountInKobo = Number(amount) * 100;

    // Generate unique reference
    const reference = `ENR_${Date.now()}_${userId.substring(0, 8)}`;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        courseId,
        courseName: course.title,
        amount,
        currency: course.currency,
        status: "PENDING",
        provider: "paystack",
        providerTransactionId: reference,
        metadata: {
          reference,
          email: user.email,
          courseId,
          userId,
        },
      },
    });

    const paystackResponse = await paystackService.initializeTransaction({
      email: user.email,
      amount: amountInKobo,
      reference,
      metadata: {
        userId,
        courseId,
        transactionId: transaction.id,
        courseName: course.title,
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: `${user.firstName} ${user.lastName}`,
          },
          {
            display_name: "Course",
            variable_name: "course",
            value: course.title,
          },
        ],
      },
      callback_url: `${process.env.CLIENT_BASE_URL}/payment/callback`,
    });

    res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        transactionId: transaction.id,
        reference,
        authorizationUrl: paystackResponse.authorization_url,
        accessCode: paystackResponse.access_code,
        amount: amount,
        currency: course.currency,
      },
    });
  }
);

////VERIFY PAYMENT AND COMPLETE ENROLLMENT
export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { reference } = req.params;
    const userId = req.user!.id;

    //get the transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        providerTransactionId: reference,
        userId,
      },
    });

    if (!transaction) {
      throw ApiError.notFound(
        "Transaction not found, Please make the payment again"
      );
    }

    if (transaction.status === "COMPLETED") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified, Your purchase was completed",
        data: {
          transaction,
          enrolled: true,
        },
      });
    }

    ////Verify the paymnet with mercahnct
    const paystackVerification = await paystackService.verifyTransaction(
      reference
    );

    if (!paystackVerification.status) {
      throw ApiError.badRequest(
        "Payment verification failed, Please try again"
      );
    }

    const paymentData = paystackVerification.data;

    if (paymentData.status !== "success") {
      ////if succesful update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          metadata: {
            ...(transaction.metadata as any),
            paystackResponse: paymentData,
          },
        },
      });

      throw ApiError.badRequest(
        "Payment was not successful, Please try again later"
      );
    }

    await prisma.$transaction(async (tx) => {
      // Update transaction status
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "COMPLETED",
          metadata: {
            ...(transaction.metadata as any),
            paystackResponse: paymentData,
            verifiedAt: new Date().toISOString(),
          },
        },
      });

      await tx.enrollment.create({
        data: {
          userId: transaction.userId,
          courseId: transaction.courseId!,
          pricePaid: transaction.amount,
          currency: transaction.currency,
          status: "ACTIVE",
        },
      });

      /////update course enrollment count
      await tx.course.update({
        where: { id: transaction.courseId! },
        data: {
          enrollmentCount: { increment: 1 },
        },
      });

      ////Remove from wishlist if exists
      await tx.wishlist.deleteMany({
        where: {
          userId: transaction.userId,
          courseId: transaction.courseId!,
        },
      });
    });

    // Get updated transaction
    const updatedTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and enrollment completed successfully",
      data: {
        transaction: updatedTransaction,
        enrolled: true,
      },
    });
  }
);

///PAYSTACK WEBHOOKS
export const paystackWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      throw ApiError.unauthorized("Invalid signature");
    }

    const event = req.body;

    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data);
        break;

      case "charge.failed":
        await handleChargeFailed(event.data);
        break;

      case "refund.processed":
        await handleRefundProcessed(event.data);
        break;

      default:
        logger.warn(
          `Unhandled webhook event, Something went wrong: ${event.event}`
        );
    }

    res.status(200).json({ status: "success" });
  }
);

////GET TRANSACTION DETAILS
export const getTransactionDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw ApiError.notFound(
        "Transaction not found, Please click a valid transaction"
      );
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  }
);

////GET USERS TRANSACTION HISTORY
export const getTransactionHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          courseId: true,
          courseName: true,
          amount: true,
          currency: true,
          status: true,
          provider: true,
          providerTransactionId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);
