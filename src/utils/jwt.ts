import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as Secret | string;

export const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, SECRET);
  return token;
};

export const isTokenValid = (token: string) => {
  const isValid = jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  return isValid;
};
