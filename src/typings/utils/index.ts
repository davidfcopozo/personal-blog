import { Response } from "express";
import { UserType } from "../types";

export interface SendPasswordResetEmailProps {
  firstName: String;
  email: String;
  token: String;
  baseUrl: String;
}

export interface SendVerificationEmailProps {
  firstName: String;
  email: String;
  verificationToken: String;
  baseUrl: String;
}

export interface AttachCookiesToResponseProps {
  user: UserType;
  res: Response;
}

export interface EmailOptionsProps {
  from: String | undefined;
  to: String;
  subject: String;
  html: String;
}
