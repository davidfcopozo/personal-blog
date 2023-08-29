import jwt, { JwtPayload } from "jsonwebtoken";

export const generateJWT = ({ payload }: JwtPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

export const isTokenValid = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string);
