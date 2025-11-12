import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("PostgreSQL connected successfully ");
  } catch (error) {
    logger.error("PostgreSQL connection error:", error);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

///Handle disconection
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  logger.warn("Prisma disconnected");
});

export default prisma;
