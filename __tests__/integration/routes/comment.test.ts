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

describe("Comment routes", () => {
  describe("POST /comments/:id", () => {});
});
