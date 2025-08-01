import { Response, Request } from "express";
import { UserType } from "../types";

export interface SendPasswordResetEmailProps {
  firstName: String;
  email: String;
  token: String;
  baseUrl: String;
  locale?: String;
  proxyOrVPN?: Boolean | undefined;
  geoLocation?: String | undefined;
  ip?: String | undefined;
}

export interface SendPasswordChangedEmailProps {
  firstName: String;
  email: String;
  baseUrl: String;
  locale?: String;
  proxyOrVPN?: Boolean | undefined;
  geoLocation?: String | undefined;
  ip?: String | undefined;
}

export interface SendVerificationEmailProps {
  firstName: String;
  email: String;
  verificationToken: String;
  baseUrl: String;
  locale?: String;
}

export interface AttachCookiesToResponseProps {
  user: UserType;
  res: Response;
}

export interface NextRequestProps {
  res: Response;
  req: Request;
}
export interface NextReq {
  req: Request;
}

export interface NextRes {
  res: Response;
}

export interface EmailOptionsProps {
  from: String | undefined;
  to: String;
  subject: String;
  html: String;
}
