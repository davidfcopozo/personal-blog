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
/* 

let TEST_USER = {
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
    /*   describe("Create a post", () => {
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
    }); */

    /*  describe("Get posts", () => {
      it("#1 should throw an error if no posts are found", async () => {
        const res = await agent.get(`${BASE_URL}/posts/64c7e2ca37fcaa5384a28fdb`)

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.msg).toBe("Posts not found");
      });

      it("#2 should throw an error if a post does not exist", async () => {
        const res = await agent.get(`${BASE_URL}/posts/64c7e2ca37fcaa5384a28fdb`)

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.msg).toBe("Post not found");
      });

      it("#3 should return a post if it exists", async () => {
        const res = await agent.get(`${BASE_URL}/posts/64c7e2ca37fcaa5384a28fda`)

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe("Post 1");
        expect(res.body.data.content).toBe("Content of post 1");
        expect(res.body.data.image).toBe("Image of post 1");
        expect(res.body.data.postedBy).toBe("648dce371dca718fb662f5bb");
        expect(res.body.data.likes).toHaveLength(1);
        expect(res.body.data.comments).toHaveLength(2);
        expect(res.body.data.published).toBeFalsy();
        expect(res.body.data.draft).toBeTruthy();
        expect(res.body.data.tags).toHaveLength(1);
        expect(res.body.data.categories).toHaveLength(1);
        expect(res.body.data.views).toBe(3);
      });

      it("#4 should return all posts if any", async () => {
        const res = await agent.get(`${BASE_URL}/posts`)

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0].title).toBe("Post 1");
        expect(res.body.data[0].content).toBe("Content of post 1");
        expect(res.body.data[0].image).toBe("Image of post 1");
        expect(res.body.data[0].postedBy).toBe("648dce371dca718fb662f5bb");
        expect(res.body.data[0].likes).toHaveLength(1);
        expect(res.body.data[0].comments).toHaveLength(2);
        expect(res.body.data[0].published).toBeFalsy();
        expect(res.body.data[0].draft).toBeTruthy();
        expect(res.body.data[0].tags).toHaveLength(1);
        expect(res.body.data[0].categories).toHaveLength(1);
        expect(res.body.data[0].views).toBe(3);
      });
    });
     */

    /*     
    describe("Update post", () => {
      it("#1 should throw an error if a user is not logged in", async () => {
        const res = await agent.put(`${BASE_URL}/posts/64c7e2ca37fcaa5384a28fda`).send({
          title: "Test post",
          content: "Test content",
        });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
        });

        it("#2 should throw an error if a post does not exist", async () => {
          await agent.post(`${BASE_URL}/auth/login`).send({
            email: EXISTING_TEST_USER.email_verified,
            password: EXISTING_TEST_USER.password,
          });
          const res = await agent.put(`${BASE_URL}/posts/64c7e2ca37fcaa5384a28fdb`).send({
            title: "Test post",
            content: "Test content",
          });
  
          expect(res.status).toBe(StatusCodes.NOT_FOUND);
          expect(res.body.msg).toBe("Post not found");
        });

        it("#3 should throw an error if a post does not belong to the user", async () => {
          const res = await agent.put(`${BASE_URL}/posts/64c7e2ca37fcaa5384a28fda`).send({
            title: "Test post",
            content: "Test content",
          });
  
          expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
          expect(res.body.msg).toBe("You are not authorized to update this post");
        });

        it("#4 should throw an error if no data to update is provided", async () => {
          const res = await agent.put(`${BASE_URL}/posts/659ee2ac62452741e01eda12`).send({});
  
          expect(res.status).toBe(StatusCodes.BAD_REQUEST);
          expect(res.body.msg).toBe("Nothing to update. Please provide the data to be updated");
        });

        it("#5 should update a post if it exists and belongs to the user", async () => {
          
          const res = await agent.put(`${BASE_URL}/posts/659ee2ac62452741e01eda12`).send({
            title: "post 2",
            content: "content of post 2",
          });

          console.log(res.body);

          const post = await agent.get(`${BASE_URL}/posts/659ee2ac62452741e01eda12`);
  
          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe("post 2");
          expect(res.body.data.content).toBe("content of post 2");
          expect(post.body.data.image).toBe("Image of post 2");
          expect(post.body.data.postedBy).toBe("64d54305628f33c4eec82b49");
          expect(post.body.data.likes).toHaveLength(0);
          expect(post.body.data.comments).toHaveLength(0);
          expect(post.body.data.tags).toHaveLength(0);
          expect(post.body.data.published).toBeFalsy();
          expect(post.body.data.draft).toBeTruthy();
          expect(post.body.data.categories).toHaveLength(0);
          expect(post.body.data.views).toBe(0);
        });

      });
 */

    describe("Post like toggle", () => {
      it("#1 should throw an error if a user is not logged in", async () => {
        const res = await agent
          .put(`${BASE_URL}/posts`)
          .send({ postId: "64c7e2ca37fcaa5384a28fda" });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
      });

      it("#2 should throw an error if a post does not exist", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send({
          email: EXISTING_TEST_USER.email_verified_two,
          password: EXISTING_TEST_USER.password,
        });
        const res = await agent
          .put(`${BASE_URL}/posts`)
          .send({ postId: "64c7e2ca37fcaa5384a28fdb" });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.msg).toBe(
          "This post doesn't exist or has been deleted"
        );
      });

      it("#3 should add or remove a like to a post if it exists", async () => {
        const post = await agent.get(
          `${BASE_URL}/posts/64c7e2ca37fcaa5384a28fda`
        );

        const likes = post.body.data?.likes;

        const res = await agent
          .put(`${BASE_URL}/posts`)
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
      });
    });
  });
});
