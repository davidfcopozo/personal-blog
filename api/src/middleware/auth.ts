import { NextFunction, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { isTokenValid } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Unauthenticated } from "../errors";

export const auth = (
  req: Request | any,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token;

    const authCookie = req.signedCookies;
    if (authCookie && authCookie.token) {
      token = authCookie.token;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new Unauthenticated("Unauthorized: No token provided");
    }

    const validToken: JwtPayload | string | boolean = isTokenValid(token);
    if (!validToken) {
      throw new Unauthenticated("Unauthorized: Invalid token");
    }
    req.user = validToken;
    next();
  } catch (err) {
    return next(err);
  }
};
