const CustomAPIError = require("./custom-error");
import { StatusCodes } from "http-status-codes";

class BadRequest extends CustomAPIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
