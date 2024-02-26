import { generateJWT, isTokenValid } from "../../../src/utils/jwt";
import User from "../../../src/models/userModel";
import { createUserPayload } from "../../../src/utils/createUserPayload";

describe("JWT", () => {
  describe("generateJWT", () => {
    it("should generate a JWT", async () => {
      let users = await User.find({});
      let threeUsers = users.slice(0, 3);
      threeUsers?.forEach((user) => {
        let payload = createUserPayload(user);
        let token = generateJWT(payload);
        expect(typeof token).toBe("string");
        expect(token).not.toBe("");
      });
    });
  });

  describe("isTokenValid", () => {
    it("should return decoded token if token is valid", async () => {
      let users = await User.find({});
      let threeUsers = users.slice(0, 3);
      threeUsers?.forEach((user) => {
        let payload = createUserPayload(user);
        let token = generateJWT(payload);
        let isValid = isTokenValid(token);

        expect(typeof isValid).toBe("object");
        expect(isValid).toHaveProperty("firstName", user.firstName);
        expect(isValid).toHaveProperty("userId", user._id.toString());
        expect(isValid).toHaveProperty("role", user.role);
        expect(isValid).toHaveProperty("iat");
      });
    });

    it("should return false if token is invalid", async () => {
      let users = await User.find({});
      let threeUsers = users.slice(0, 3);
      threeUsers?.forEach((user) => {
        let payload = createUserPayload(user);
        let token = generateJWT(payload);
        let isValid = isTokenValid(token + "invalid");
        expect(isValid).toBe(false);
      });
    });
  });
});
