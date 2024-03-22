import request from "supertest";
import app from "../../../src";
import { StatusCodes } from "http-status-codes";

const agent = request.agent(app);

const BASE_URL = "/api/v1";
let EXISTING_TEST_USER = {
  email_verified: "davidfco.pozo@gmail.com",
  email_verified_two: "davidfco.pozo@hotmail.com",
  email_not_verified: "kdavidfco.pozo@dsjdsaa.com",
  password: "123456",
};

describe("Replies routes", () => {
  let newReplyId: string;
  beforeAll(async () => {
    await agent.post(`${BASE_URL}/auth/logout`).send({
      email: EXISTING_TEST_USER.email_verified_two,
      password: EXISTING_TEST_USER.password,
    });
  });
  describe("Post routes", () => {
    describe("Create a reply - POST /replies/:id", () => {
      it("#1 should throw an error if user is not authenticated", async () => {
        const res = await agent.post(`${BASE_URL}/replies/123456`);

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
      });

      it("#2 should throw an error if the post does not exist", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified_two,
          password: EXISTING_TEST_USER.password,
        });

        const res = await agent
          .post(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fdb`)
          .send({ content: "This is a test reply*****" });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe(
          "The post you're trying to comment on does not exist"
        );
      });

      it("#3 should create a reply", async () => {
        const res = await agent
          .post(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
          .send({
            content: "Test reply",
            commentId: "64d52225e973681ba9af5a63",
          });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body.success).toBe(true);
        expect(res.body.data.content).toBe("Test reply");

        newReplyId = res.body.data._id;
      });
    });
  });

  describe("Get routes - GET /replies", () => {
    describe("Get all replies - GET /replies", () => {
      it("#1 should throw an error if postId is not provided", async () => {
        const res = await agent.get(`${BASE_URL}/replies`).send({
          commentId: "64d52225e973681ba9af5a63",
        });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Please provide a post and comment id");
      });

      it("#2 should throw an error if commentId is not provided", async () => {
        const res = await agent.get(`${BASE_URL}/replies`).send({
          postId: "64c7e2ca37fcaa5384a28fda",
        });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Please provide a post and comment id");
      });

      it("#3 should throw an error if the comment being replied to does not exist", async () => {
        const res = await agent.get(`${BASE_URL}/replies`).send({
          postId: "64c7e2ca37fcaa5384a28fdb",
          commentId: "64d52233e973681ba9af5a68",
        });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe(
          "This comment doesn't exist or has been deleted"
        );
      });

      it("#4 should throw an error if there are no replies", async () => {
        const res = await agent.get(`${BASE_URL}/replies`).send({
          postId: "64c7e2ca37fcaa5384a28fda",
          commentId: "64d52233e973681ba9af5a69",
        });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("No replies on this comment yet");
      });

      it("#5 should get all replies", async () => {
        const res = await agent.get(`${BASE_URL}/replies`).send({
          postId: "64c7e2ca37fcaa5384a28fda",
          commentId: "64d52225e973681ba9af5a63",
        });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
      });
    });

    describe("Get a reply by ID - GET /replies", () => {
      it("#1 should throw an error if commentId is not provided", async () => {
        const res = await agent
          .get(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
          .send({
            commentId: "64d52225e973681ba9af5a63",
          });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Please provide a comment and reply id");
      });

      it("#2 should throw an error if replyId is not provided", async () => {
        const res = await agent
          .get(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
          .send({
            replyId: "64c7e2ca37fcaa5384a28fda",
          });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Please provide a comment and reply id");
      });

      it("#3 should throw an error if the reply does not exist", async () => {
        const res = await agent
          .get(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
          .send({
            commentId: "64d52225e973681ba9af5a63",
            replyId: "64d52233e973681ba9af5a68",
          });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe(
          "This comment does not exist or has been deleted"
        );
      });

      it("#4 should get a comment by ID", async () => {
        //const res = await agent.get(`${BASE_URL}/replies/${newReplyId}`);
        const res = await agent
          .get(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
          .send({
            commentId: "64d52225e973681ba9af5a63",
            replyId: newReplyId,
          });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(newReplyId);
      });
    });
  });

  describe("Delete routes - DELETE /replies", () => {
    it("#1 should throw an error if commentId is not provided", async () => {
      const res = await agent
        .delete(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
        .send({
          commentId: "64d52225e973681ba9af5a63",
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toBe("Please provide a comment and reply id");
    });

    it("#2 should throw an error if replyId is not provided", async () => {
      const res = await agent
        .delete(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
        .send({
          replyId: "64c7e2ca37fcaa5384a28fda",
        });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toBe("Please provide a comment and reply id");
    });

    it("#3 should throw an error if a user is not logged in", async () => {
      await agent.get(`${BASE_URL}/auth/logout`).send({
        email: EXISTING_TEST_USER.email_verified_two,
        password: EXISTING_TEST_USER.password,
      });
      const res = await agent
        .delete(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
        .send({ commentId: "64d52233e973681ba9af5a69", replyId: newReplyId });

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toBe("Unauthorized: No token provided");
    });

    it("#4 should throw an error if a comment does not exist", async () => {
      await agent.post(`${BASE_URL}/auth/login`).send({
        email: EXISTING_TEST_USER.email_verified_two,
        password: EXISTING_TEST_USER.password,
      });
      const res = await agent
        .delete(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fdb`)
        .send({ commentId: "64d52233e973681ba9af5a68", replyId: newReplyId });

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.msg).toBe(
        "This comment doesn't exist or has been deleted"
      );
    });

    it("#5 should throw an error if the post id is not equal to the post's id the comment belongs", async () => {
      const res = await agent
        .delete(`${BASE_URL}/replies/659ee2ac62452741e01eda12`)
        .send({ commentId: "64d52233e973681ba9af5a69", replyId: newReplyId });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.msg).toBe("Something went wrong");
    });

    it("#6 should delete a comment", async () => {
      const res = await agent
        .delete(`${BASE_URL}/replies/64c7e2ca37fcaa5384a28fda`)
        .send({ commentId: "64d52225e973681ba9af5a63", replyId: newReplyId });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.msg).toBe("Comment has been successfully deleted.");
    });
  });
});
