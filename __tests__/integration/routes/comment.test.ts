import request from "supertest";
import app from "../../../src";
import { StatusCodes } from "http-status-codes";
/* import { UserType } from "../../../src/typings/types";
import User from "../../../src/models/userModel"; */

const agent = request.agent(app);

const BASE_URL = "/api/v1";
let EXISTING_TEST_USER = {
  email_verified: "davidfco.pozo@gmail.com",
  email_verified_two: "davidfco.pozo@hotmail.com",
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
let passwordResetToken: string; */

describe("Comment routes", () => {
  beforeAll(async () => {
    await agent.post(`${BASE_URL}/auth/logout`).send({
      email: EXISTING_TEST_USER.email_verified,
      password: EXISTING_TEST_USER.password,
    });
  });
  /*   describe("Post routes", () => {
    describe("Create a post - POST /comments/:id", () => {
      it("#1 it should throw an error if user is not authenticated", async () => {
        const res = await agent.post(`${BASE_URL}/comments/123456`);

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
      });

      it("#2 it should throw an error if the post does not exist", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent
          .post(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fdb`)
          .send({ content: "This is a test comment*****" });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe(
          "The post you're trying to comment on does not exist"
        );
      });

      it("#3 it should create a comment", async () => {
        const res = await agent
          .post(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fda`)
          .send({ content: "Test comment" });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body.success).toBe(true);
        expect(res.body.data.content).toBe("Test comment");
        console.log(res.body);

        await agent
          .delete(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fda`)
          .send({ commentId: res.body.data._id });
      });
    });
  }); */

  /*   describe("Get routes - GET /comments", () => {
    describe("Get all comments - GET /comments", () => {
      it("#1 it should throw an error if the post does not exist", async () => {
        const res = await agent.get(`${BASE_URL}/comments`).send({
          postId: "64c7e2ca37fcaa5384a28fdb",
        });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("This post doesn't exist");
      });

      it("#2 it should throw an error if there are no comments", async () => {
        const res = await agent.get(`${BASE_URL}/comments`).send({
          postId: "659ee2ac62452741e01eda12",
        });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("No comments on this post");
      });
    });

    describe("Get a comment by ID - GET /comments", () => {
      it("#1 it should throw an error if the comment does not exist", async () => {
        const res = await agent.get(
          `${BASE_URL}/comments/64d52233e973681ba9af5a68`
        );

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("No comments found");
      });

      it("#2 it should get a comment by ID", async () => {
        const res = await agent.get(
          `${BASE_URL}/comments/64d52233e973681ba9af5a69`
        );

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe("64d52233e973681ba9af5a69");
        console.log(res.body);
      });
    });
  }); */

  describe("Put routes - PUT /comments", () => {
    describe("Comments like toggle", () => {
      it("#1 should throw an error if a user is not logged in", async () => {
        await agent.get(`${BASE_URL}/auth/logout`).send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent
          .put(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fda`)
          .send({ commentId: "64d52233e973681ba9af5a69" });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
      });

      it("#2 should throw an error if a comment does not exist", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified_two,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent
          .put(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fda`)
          .send({ commentId: "64c7e2ca37fcaa5384a28fdb" });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.msg).toBe("No comments found");
      });

      it("#3 should throw an error if the post id is not equal to the comment's post property", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified,
          password: EXISTING_TEST_USER.password,
        });

        const res = await agent
          .put(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fdb`)
          .send({ commentId: "64d52233e973681ba9af5a69" });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.msg).toBe("This comment does not belong to this post");
      });

      /*       it("#4 should add or remove a like to a comment if it exists", async () => {
        const comment = await agent
          .get(`${BASE_URL}/comments/64c7e2ca37fcaa5384a28fda`)
          .send({ commentId: "64d52233e973681ba9af5a69" });

        const likes = comment.body?.likes;

        const res = await agent
          .put(`${BASE_URL}/comments`)
          .send({ postId: "64c7e2ca37fcaa5384a28fda" });

        const isLiked = likes?.filter(
          (like: any) => like.toString() === "648dce371dca718fb662f5bb"
        );
        const updatedPost = await agent.get(
          `${BASE_URL}/posts/64c7e2ca37fcaa5384a28fda`
        );

        const updatedLikes = await updatedPost.body.data?.likes;

        if (isLiked?.length < 1) {
          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body.success).toBe(true);
          expect(res.body.msg).toBe("You've liked this post.");
          expect(updatedLikes?.length).toBe(likes?.length + 1);
        } else {
          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body.success).toBe(true);
          expect(res.body.msg).toBe("You've disliked this post.");
          expect(updatedLikes?.length).toBe(likes?.length - 1);
        }
      }); */
    });
  });
});
