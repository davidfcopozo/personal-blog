import { Request } from "express";

export interface IUser {
  name: String;
  email: String;
  password: String;
  role: String;
  verificationToken?: String;
  verified?: Boolean;
  verifiedAt?: Date;
  passwordVerificationToken: String;
  passwordExpirationDate: Date;
}
export interface IRequestWithUserInfo extends Request {
  user: {
    userId: String;
  };
}
