import { NextFunction, Response } from "express";
import { isTokenValid } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

/**
 * Optional authentication middleware
 * Sets userId if valid token is present, but doesn't throw error if not authenticated
 */
export const optionalAuth = (
  req: Request | any,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = isTokenValid(token) as JwtPayload;
    req.userId = payload.userId;
  } catch (error) {
    // Invalid token, continue without user ID
  }

  next();
};
