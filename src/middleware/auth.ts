import { NextFunction, Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");
//import jwt from "jsonwebtoken";
//const User = require("../models/userModel");
require("dotenv").config();
const { isTokenValid } = require("../utils/jwt");

const auth = (req: Request | any, res: Response, next: NextFunction) => {
  const authCookie = req.signedCookies;
  console.log(authCookie);

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

  const validToken = isTokenValid(token);

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

module.exports = auth;
