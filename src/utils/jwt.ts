import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as Secret | string;

export const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, SECRET);

  return token;
};

export const isTokenValid = (token: string): JwtPayload | boolean | string => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return false;
  }
};
