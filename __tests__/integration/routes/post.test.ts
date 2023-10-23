import request from "supertest";
import app from "../../../src";
import { StatusCodes } from "http-status-codes";
/* import { UserType } from "../../../src/typings/types";
import User from "../../../src/models/userModel"; */

const agent = request.agent(app);

const BASE_URL = "/api/v1";
let EXISTING_TEST_USER = {
  email_verified: "davidfco.pozo@gmail.com",
  email_not_verified: "kdavidfco.pozo@dsjdsaa.com",
  password: "123456",
};
/* let TEST_USER = {
  email: "kixeqygy@lyft.live",
  password: "123456",
};

let INVALID_TEST_USER = {
  email: "@gmail.com",
  username: ".example",
  password: "12",
}; 

let user: UserType;
let passwordResetToken: string;
*/

describe("Post routes", () => {
  describe("POST /posts", () => {
    describe("Create a new post", () => {
      it("#1 should throw an error if a user is not logged in", async () => {
        const res = await agent.post(`${BASE_URL}/posts`).send({
          title: "Test post",
          content: "Test content",
        });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
      });

      it("#2 should throw an error if title and content are not provided", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent.post(`${BASE_URL}/posts`).send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Title and content are required");
      });

      it("#3 should throw an error if title is not provided", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent.post(`${BASE_URL}/posts`).send({
          content: "Test content",
        });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Title is required");
      });

      it("#4 should throw an error if content is not provided", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent.post(`${BASE_URL}/posts`).send({
          title: "Test content",
        });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Content is required");
      });

      it("#5 should create a new post if title and content are provided", async () => {
        const res = await agent.post(`${BASE_URL}/posts`).send({
          title: "Test post",
          content: "Test content",
        });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body.success).toBe(true);
        expect(res.body.post.title).toBe("Test post");
        expect(res.body.post.content).toBe("Test content");

        const deletePost = await agent.delete(
          `${BASE_URL}/posts/${res.body.post._id}`
        );
        expect(deletePost.status).toBe(StatusCodes.OK);
      });
    });
  });
});
