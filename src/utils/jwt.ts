const jwt = require("jsonwebtoken");

const generateJWT = ({ payload }: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token: any) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generateJWT, isTokenValid };
