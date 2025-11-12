export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;
  errors?: unknown;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    errors?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = statusCode < 500 ? isOperational : false;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common errors
  static notFound(resource: string) {
    return new ApiError(`${resource} not found`, 404);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403);
  }

  static conflict(message: string) {
    return new ApiError(message, 409);
  }

  static validation(message: string, errors?: unknown) {
    return new ApiError(message, 400, true, errors);
  }

  static badRequest(message: string) {
    return new ApiError(message, 400);
  }

  static internal(message = "Internal server error") {
    return new ApiError(message, 500, false);
  }
}
