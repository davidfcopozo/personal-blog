import request from "supertest";
import app from "../../../src";
import { StatusCodes } from "http-status-codes";
import { UserType } from "../../../src/typings/types";
import User from "../../../src/models/userModel";

const agent = request.agent(app);

const BASE_URL = "/api/v1";
let TEST_USER = {
  email: "wicosy@socam.me",
  password: "123456",
};
let user: UserType;

describe("Auth routes", () => {
  describe("POST /auth/register", () => {
    it("should be able to register a new user", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: "testing",
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(201);
      expect(res.body.msg).toBe(
        "Account registration successful! Please check your email to verify account"
      );
    });

    it("should be able to throw an error if a user already exists", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: "testing",
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("An account with this email already exists");
    }, 50000);
  });

  describe("POST /auth/login", () => {
    it("should be able to login a user", async () => {
      user = await User.findOne({ email: TEST_USER.email });

      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(user?._id.toString());
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /auth/send-verification-token", () => {
    it("should be able to send a verification token", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/send-verification-token`)
        .send({
          email: TEST_USER.email,
        });

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe(
        "Email verification had been resent, please check your email."
      );
    });
  });

  describe("DELETE /auth/users/:id", () => {
    it("should delete a user", async () => {
      const res = await agent.delete(`${BASE_URL}/users/${user?._id}`);

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("User has been successfully deleted");
    });
  });
});
