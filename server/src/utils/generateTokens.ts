import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";
import { CookieOptions } from "express";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = (maxAgeMs: number): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: maxAgeMs,
  path: "/",
});

export const generateRefreshToken = (
  res: Response,
  userId: string,
  userRole: any
) => {
  const refreshToken = jwt.sign(
    { userId, userRole },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    cookieOptions(7 * 24 * 60 * 60 * 1000)
  );

  return refreshToken;
};

export const generateAccessToken = (
  res: Response,
  userId: string,
  userRole: any
) => {
  const accessToken = jwt.sign(
    { userId, userRole },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "3h",
    }
  );

  res.cookie("accessToken", accessToken, cookieOptions(3 * 60 * 60 * 1000));

  return accessToken;
};
