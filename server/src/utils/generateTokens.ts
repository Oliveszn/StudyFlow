import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

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
      expiresIn: "3hr",
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 3 * 60 * 60 * 1000,
    path: "/",
  });

  return accessToken;
};
