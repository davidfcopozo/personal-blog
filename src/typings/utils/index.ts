import { Response } from "express";

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
  user: any;
  res: Response;
}
