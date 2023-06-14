const { StatusCodes } = require("http-status-codes");
import { Request, Response, NextFunction } from "express";

type errorHandlerMiddlewareProps = {
  err: any;
  req: Request;
  res?: Response;
  next?: NextFunction;
};

const errorHandlerMiddleware = ({ err, res }: errorHandlerMiddlewareProps) => {
  let customError = {
    //Set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  //Check if the error is about email or password validation which name of the mongoose err object is 'ValidationError
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => (item as Error).message)
      .join(", ");

    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    //If the code number of the mongoose err object is equal to 11000 (meaning there is a duplicate value)
    //Modify the following properties from the customError object
    customError.msg = `Duplicate value enter for the ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  //Check if the error is about invalid job id which name of the mongoose err object is "CastError"
  if (err.name === "CastError") {
    customError.msg = `Not item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  /* This will get us the mongoose err object */
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  /* This will get us our customError object */
  return res?.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
