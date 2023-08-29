import { StatusCodes } from "http-status-codes";
import { Response } from "express";

export const errorHandlerMiddleware = (res: Response, err: any) => {
  let customError = {
    //Set default
    statusCode: err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err?.message || "Something went wrong, please try again later",
  };
  console.log("Error name==>", err?.name);

  if (err?.name === "ValidationError") {
    //Check if the error is about email or password validation which name of the mongoose err object is 'ValidationError
    customError.msg = Object.values(err.errors)
      .map((item) => (item as Error)?.message)
      .join(", ");

    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err?.code && err.code === 11000) {
    //If the code number of the mongoose err object is equal to 11000 (meaning there is a duplicate value)
    //Modify the following properties from the customError object
    customError.msg = `Duplicate value entered for the ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //Check if the error is about invalid id which name of the mongoose err object is "CastError"
  if (err?.name === "CastError") {
    customError.msg = `Not item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  /* This will get us the mongoose err object */
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  /* This will get us our customError object */
  return res?.status(customError.statusCode).json({ msg: customError.msg });
};