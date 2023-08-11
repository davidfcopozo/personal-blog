import jwt from "jsonwebtoken";

export const generateJWT = ({ payload }: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

export const isTokenValid = (token: any) =>
  jwt.verify(token, process.env.JWT_SECRET as string);
