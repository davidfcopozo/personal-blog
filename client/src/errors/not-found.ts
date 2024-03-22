import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";

export class NotFound extends CustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
