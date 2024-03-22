import { createUserPayload } from "../../../src/utils/createUserPayload";
import User from "../../../src/models/userModel";

describe("Utils unit tests", () => {
  describe("function createUserPayload", () => {
    it("should create a user payload", async () => {
      let users = await User.find({});
      let threeUsers = users.slice(0, 3);
      threeUsers?.forEach((user) => {
        let payload = createUserPayload(user);
        expect(payload).toHaveProperty("firstName", user.firstName);
        expect(payload).toHaveProperty("userId", user._id);
        expect(payload).toHaveProperty("role", user.role);
      });
    });
  });
});
