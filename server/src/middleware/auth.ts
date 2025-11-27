import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/error";
import prisma from "../prisma";

interface MyJwtPayload extends JwtPayload {
  userId: string;
  userRole?: string;
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  ////for mobile, authorization header
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  ////for web, check cookies
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  //if there aare no tokens found
  if (!token) return next(ApiError.unauthorized("Not authenticated"));

  try {
    ///first verify the token
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as MyJwtPayload;

    ///load the user from db
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(ApiError.unauthorized("User not found"));
    }

    ///attach the user to the request
    req.user = { id: user.id, role: user.role };
    return next();
  } catch (err) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw ApiError.unauthorized("Not authorized to access this route");
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};
