import crypto from "crypto";

const hashString = (string: string): string => {
  return crypto.createHash("sha256").update(string).digest("hex");
};

module.exports = hashString;
