require("dotenv").config();

interface Options {
  expires: number;
  httpOnly: boolean;
  secure?: boolean;
}

type AttachCookiesToResponseProps = {
  user: any;
  res: any;
};

export const attachCookiesToResponse = ({
  user,
  res,
}: AttachCookiesToResponseProps) => {
  const token = user.getJWT();

  const options: Options = {
    expires: 60 * 60 * 1000,
    httpOnly: true,
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
