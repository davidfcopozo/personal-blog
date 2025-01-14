export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }

  static BadRequest(message: string) {
    return new ApiError(message, 400);
  }

  static Unauthorized(message: string) {
    return new ApiError(message, 401);
  }

  static NotFound(message: string) {
    return new ApiError(message, 404);
  }

  static InternalServer(message: string = "Internal server error") {
    return new ApiError(message, 500);
  }
}
