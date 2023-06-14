const CustomError = require("./custom-error");
import { StatusCodes } from "http-status-codes";

class BadRequest extends CustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
