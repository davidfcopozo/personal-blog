import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
require("dotenv").config();
import { isTokenValid } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const auth = (req: Request | any, res: Response, next: NextFunction) => {
  const authCookie = req.signedCookies;

  if (!authCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  const token = authCookie.token;
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  const validToken: JwtPayload | string = isTokenValid(token);

  if (!validToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  try {
    req.user = validToken;
    next();
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }
};
