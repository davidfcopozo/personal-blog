import { StatusCodes } from "http-status-codes";
const CustomAPIError = require("./custom-error");

class Unauthenticated extends CustomAPIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthenticated;
