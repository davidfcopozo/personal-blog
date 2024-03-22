export class CustomError {
  msg!: string;
  statusCode!: number;

  constructor(message: string, status: number = 500) {
    this.msg = message;
    this.statusCode = status;
  }
}
