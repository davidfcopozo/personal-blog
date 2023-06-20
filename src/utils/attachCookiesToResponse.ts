import { CookieOptions, Response } from "express";

require("dotenv").config();

type AttachCookiesToResponseProps = {
  user: any;
  res: Response;
};

const attachCookiesToResponse = ({
  user,
  res,
}: AttachCookiesToResponseProps) => {
  const token = user.getJWT();
  console.log(token);

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
    id: user._id,
    role: user.role,
  });
};

module.exports = attachCookiesToResponse;
