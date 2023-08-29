import { CookieOptions } from "express";
import { AttachCookiesToResponseProps } from "../typings/utils";
import dotenv from "dotenv";

dotenv.config();

export const attachCookiesToResponse = ({
  user,
  res,
}: AttachCookiesToResponseProps) => {
  const token = user?.getJWT();

  const options: CookieOptions = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    signed: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.cookie("token", token, options).json({
    success: true,
    id: user?._id,
    role: user?.role,
  });
};
