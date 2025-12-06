import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/error";
import logger from "../utils/logger";

interface ExtendedError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: any;
  code?: string | number;
  meta?: Record<string, any>;
}

const errorHandler = (
  err: ExtendedError | undefined,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 if no status code set

  if (!err) {
    err = new ApiError("Unknown error occurred", 500);
  }

  // Create a working copy of the error
  let error: ExtendedError = err;

  // Log the error for debugging

  logger.error("ERROR:", {
    timestamp: new Date().toISOString(),
    method: req?.method || "UNKNOWN",
    url: req?.originalUrl || "UNKNOWN",
    ip: req?.ip || "UNKNOWN",
    userAgent: req?.get?.("User-Agent") || "UNKNOWN",
    error: {
      name: err.name || "Error",
      message: err.message || "Unknown error",
      // stack: err.stack || "No stack trace",
      statusCode: err.statusCode || 500,
      code: err.code || null,
      stack: process.env.NODE_ENV === "development" ? err.stack : "hidden",
    },
  });

  // Special handling for common error types
  if (err.name === "ValidationError") {
    error = ApiError.validation("Validation failed", err.errors);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token. Please log in again");
  }
  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token expired. Please log in again");
  }

  //Prisma Error Handling
  switch (err.code) {
    case "P2002": {
      // Unique constraint failed
      const fields = err.meta?.target || [];
      const field = Array.isArray(fields) ? fields.join(", ") : fields;
      error = ApiError.validation(
        `A record with this ${field} already exists.`
      );
      break;
    }
    case "P2003": {
      // Foreign key constraint failed
      error = ApiError.validation(
        `Invalid relation reference — foreign key constraint failed.`
      );
      break;
    }
    case "P2025": {
      // Record not found
      error = new ApiError(`The requested record was not found.`, 404);
      break;
    }
    case "P2000": {
      // Value too long for column
      error = ApiError.validation(
        `Input value is too long for one of the fields.`
      );
      break;
    }
  }

  // Handle bad JSON
  if (err instanceof SyntaxError && "body" in err) {
    error = ApiError.validation("Invalid JSON payload", 400);
  }

  const statusCode = error.statusCode || 500;

  const responseData: any = {
    success: false,
    message: error.message || err.message || "Unknown error",
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    responseData.debug = {
      name: error.name || err.name || "Error",
      stack: error.stack || err.stack,
      ...(error.errors && { errors: error.errors }),
      ...(err.code && { code: err.code }),
    };
  } else {
    ////wehn in production we hide sensitive detials
    if (!error.isOperational || statusCode >= 500) {
      responseData.message = "Something went wrong. Please try again later.";
    }
  }

  return res.status(statusCode).json(responseData);
};

const asyncHandler = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { errorHandler, asyncHandler };
