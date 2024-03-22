import request from "supertest";
import app from "../../../src";
import { StatusCodes } from "http-status-codes";
import { UserType } from "../../../src/typings/types";
import User from "../../../src/models/userModel";

const agent = request.agent(app);

const BASE_URL = "/api/v1";
let TEST_USER = {
  email: "kixeqygy@lyft.live",
  password: "123456",
};

let EXISTING_TEST_USER = {
  email_verified: "davidfco.pozo@gmail.com",
  email_not_verified: "kdavidfco.pozo@dsjdsaa.com",
  password: "123456",
};

let INVALID_TEST_USER = {
  email: "@gmail.com",
  username: ".example",
  password: "12",
};

let user: UserType;
let passwordResetToken: string;

describe("Auth routes", () => {
  describe("POST /auth/register", () => {
    it("#1 should register a new user", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: "testing",
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      user = await User.findOne({ email: TEST_USER.email });

      expect(res.body.msg).toBe(
        "Account registration successful! Please check your email to verify account"
      );
      expect(res.status).toBe(201);
    });

    it("#2 should throw an error if a user with given email already exists", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: "testing",
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("An account with this email already exists");
    });

    it("#3 should throw an error if a user with given username already exists", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: "testing",
        email: TEST_USER.email + "o",
        password: TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("An account with this username already exists");
    });

    it("#4 should throw an error if an invalid email is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: "testingdas",
        email: INVALID_TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Invalid email address, please provide a valid one"
      );
    });

    it("#5 should throw an error if an invalid username is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/register`).send({
        firstName: "Test",
        lastName: "Test 2",
        username: INVALID_TEST_USER.username,
        email: TEST_USER.email + "oo",
        password: TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("Invalid username, please provide a valid one");
    });
  });

  describe("POST /auth/send-verification-token", () => {
    it("#1 should send a verification token", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/send-verification-token`)
        .send({
          email: EXISTING_TEST_USER.email_not_verified,
        });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.msg).toBe(
        "Email verification has been resent, please check your email."
      );
    });

    it("#2 should throw an error if an invalid email is provided", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/send-verification-token`)
        .send({
          email: INVALID_TEST_USER.email,
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Invalid email address, please provide a valid one"
      );
    });

    it("#3 should throw an error if a user doesn't exist with the given email", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/send-verification-token`)
        .send({
          email: "wicosy@socam.mee",
        });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.msg).toBe("No user found with this email address");
    });

    it("#4 should throw an error if a user is already verified", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/send-verification-token`)
        .send({
          email: EXISTING_TEST_USER.email_verified,
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("Account is verified already");
    });
  });

  describe("POST /auth/verify-email", () => {
    it("#1 should throw an error if no token is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/verify-email`).send({
        email: EXISTING_TEST_USER.email_not_verified,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("Not token provided");
    });

    it("#2 should throw an error if an invalid email is provided", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/verify-email?token=dsadsadsasda`)
        .send({
          email: INVALID_TEST_USER.email,
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Invalid email address, please provide a valid one"
      );
    });

    it("#3 should throw an error if the user is not found", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/verify-email?token=dsadsadsasda`)
        .send({
          email: TEST_USER.email + "e",
        });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.msg).toBe("No user found with this email address");
    });

    it("#4 should throw if an invalid token is provided", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/verify-email?token=dsadsadsasda`)
        .send({
          email: EXISTING_TEST_USER.email_not_verified,
        });

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(res.body.msg).toBe("Invalid verification token");
    });

    it("#5 should verify the user", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/verify-email?token=${user?.verificationToken}`)
        .send({
          email: TEST_USER.email,
        });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.msg).toBe("Email verified successfully");
    });
  });

  describe("POST /auth/login", () => {
    it("#1 throw an error if no email is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        password: EXISTING_TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("Please provide a valid email address");
    });

    it("#2 throw an error if an invalid email is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        email: "++" + EXISTING_TEST_USER.email_verified,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Invalid email address, please provide a valid one"
      );
    });

    it("#3 should throw an error if the user is not found", async () => {
      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        email: EXISTING_TEST_USER.email_verified + "ee",
        password: EXISTING_TEST_USER.password,
      });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.msg).toBe("No user found with this email address");
    });

    it("#4 should throw an error if password is not correct", async () => {
      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        email: EXISTING_TEST_USER.email_verified,
        password: TEST_USER.password + "sda",
      });

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(res.body.msg).toBe("Invalid password");
    });

    it("#5 should login a user", async () => {
      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      user = await User.findOne({ email: TEST_USER.email });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.id).toBe(user?._id.toString());
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("#1 should throw an error if no email is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/forgot-password`).send({});

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("Please provide a valid email address");
    });

    it("#2 should throw an error if an invalid email is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/forgot-password`).send({
        email: INVALID_TEST_USER.email,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Invalid email address, please provide a valid one"
      );
    });

    it("#3 should throw if no user is found", async () => {
      const res = await agent.post(`${BASE_URL}/auth/forgot-password`).send({
        email: EXISTING_TEST_USER.email_verified + "e",
      });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.msg).toBe("No user found with this email address");
    });

    it("#4 should send an email with password reset link", async () => {
      const res = await agent.post(`${BASE_URL}/auth/forgot-password`).send({
        email: EXISTING_TEST_USER.email_verified,
      });

      passwordResetToken = res.body.token;

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.msg).toBe(
        "A password reset link has been sent to your email"
      );
    });
  });

  describe("POST /auth/reset-password", () => {
    it("#1 should throw an error if no token is provided", async () => {
      const res = await agent.post(`${BASE_URL}/auth/reset-password`).send({
        email: EXISTING_TEST_USER.email_not_verified,
      });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Please provide a valid email address, password and token"
      );
    });

    it("#2 should throw an error if no email is provided", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/reset-password?token=dsadsadsasda`)
        .send({
          password: EXISTING_TEST_USER.email_not_verified,
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Please provide a valid email address, password and token"
      );
    });

    it("#3 should throw an error if no password is provided", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/reset-password?token=dsadsadsasda`)
        .send({
          email: EXISTING_TEST_USER.email_not_verified,
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe(
        "Please provide a valid email address, password and token"
      );
    });

    it("#4 should throw if an error if an invalid token is provided", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/reset-password?token=dsadsadsasda`)
        .send({
          email: EXISTING_TEST_USER.email_not_verified,
          password: EXISTING_TEST_USER.email_not_verified,
        });

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(res.body.msg).toBe("Invalid token");
    });

    it("#5 should reset the password", async () => {
      const res = await agent
        .post(`${BASE_URL}/auth/reset-password?token=${passwordResetToken}`)
        .send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.msg).toBe("Password reset successful");
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /auth/users/:id", () => {
    it("#1 should delete a user", async () => {
      const res = await agent.delete(`${BASE_URL}/users/${user?._id}`);

      expect(res.body.msg).toBe("User has been successfully deleted");
      expect(res.status).toBe(StatusCodes.OK);
    });
  });

  describe("GET /auth/logout", () => {
    it("#1 should login a user", async () => {
      const res = await agent.post(`${BASE_URL}/auth/login`).send({
        email: EXISTING_TEST_USER.email_verified,
        password: EXISTING_TEST_USER.password,
      });

      user = await User.findOne({ email: EXISTING_TEST_USER.email_verified });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.id).toBe(user?._id.toString());
      expect(res.body.success).toBe(true);
    });

    it("#2 should logout a user", async () => {
      const res = await agent.get(`${BASE_URL}/auth/logout`);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.msg).toBe("Logout successful");
    });
  });
});
