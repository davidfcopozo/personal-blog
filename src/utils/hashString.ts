import crypto from "crypto";

export const hashString = (string: string) => {
  crypto.createHash("sha256").update(string).digest("hex");
};
