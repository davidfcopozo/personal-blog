import request from "supertest";
import app from "../../../src";
import { StatusCodes } from "http-status-codes";

const agent = request.agent(app);

const BASE_URL = "/api/v1";
let TEST_USER = {
  email: "kdavidfco.pozo@dsjdsaa.com",
  password: "123456",
};

let INVALID_TEST_USER = {
  email: "@gmail.com",
  username: ".example",
  password: "12",
};

describe("User routes", () => {
  beforeAll(async () => {
    await agent.post(`${BASE_URL}/auth/logout`).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
  });
  describe("GET routes", () => {
    describe("GET /users", () => {
      it("#1 should get all users", async () => {
        const res = await agent.get(`${BASE_URL}/users`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data[0]).toHaveProperty("_id");
        expect(res.body.data[0]).toHaveProperty("email");
        expect(res.body.data[0]).toHaveProperty("role");
        expect(res.body.data[0]).toHaveProperty("verified");
        expect(res.body.data[0]).toHaveProperty("favorites");
        expect(res.body.data[0]).toHaveProperty("avatar");
        expect(res.body.data[0]).toHaveProperty("username");
        expect(res.body.data[0]).toHaveProperty("bio");
        expect(res.body.data[0]).toHaveProperty("title");
        expect(res.body.data[0]).toHaveProperty("lastName");
        expect(res.body.data[0]).toHaveProperty("firstName");
        expect(res.body.data[0]).toHaveProperty("passwordTokenExpirationDate");
      });

      describe("GET /users/:id", () => {
        it("#1 should throw an error if user does not exist", async () => {
          const res = await agent.get(
            `${BASE_URL}/users/64d54305628f33c4eec82b48`
          );

          expect(res.status).toBe(StatusCodes.NOT_FOUND);
          expect(res.body.success).toBe(false);
          expect(res.body.msg).toBe("User not found");
        });

        it("#2 should get a user by id", async () => {
          const res = await agent.get(
            `${BASE_URL}/users/64d54305628f33c4eec82b49`
          );

          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty("_id");
          expect(res.body.data).toHaveProperty("email");
          expect(res.body.data).toHaveProperty("role");
          expect(res.body.data).toHaveProperty("verified");
          expect(res.body.data).toHaveProperty("favorites");
          expect(res.body.data).toHaveProperty("avatar");
          expect(res.body.data).toHaveProperty("username");
          expect(res.body.data).toHaveProperty("bio");
          expect(res.body.data).toHaveProperty("title");
          expect(res.body.data).toHaveProperty("lastName");
          expect(res.body.data).toHaveProperty("firstName");
          expect(res.body.data).toHaveProperty("passwordTokenExpirationDate");
        });
      });
    });
  });

  describe("PATCH routes", () => {
    describe("PATCH /users/:id", () => {
      it("#1 should throw an error if user is not logged in", async () => {
        const res = await agent
          .patch(`${BASE_URL}/users/64d54305628f33c4eec82b48`)
          .send({ firstName: "David" });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Unauthorized: No token provided");
      });

      it("#2 should throw an error if user does not exist", async () => {
        await agent.post(`${BASE_URL}/auth/login`).send(TEST_USER);
        const res = await agent
          .patch(`${BASE_URL}/users/64d54305628f33c4eec82b48`)
          .send({ firstName: "David" });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Your not authorized to perform this action");
      });

      it("#3 should throw an error if no data is sent", async () => {
        const res = await agent
          .patch(`${BASE_URL}/users/64e7ccbb0dd08f180530eb65`)
          .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Please provide the fields to update");
      });

      it("#4 should throw an error if an invalid username is provided", async () => {
        const res = await agent
          .patch(`${BASE_URL}/users/64e7ccbb0dd08f180530eb65`)
          .send({ username: INVALID_TEST_USER.username });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe(
          "Invalid username, please provide a valid one"
        );
      });

      it("#5 should update a user by id", async () => {
        const res = await agent
          .patch(`${BASE_URL}/users/64e7ccbb0dd08f180530eb65`)
          .send({ firstName: "David" });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("_id");
        expect(res.body.data).toHaveProperty("email");
        expect(res.body.data).toHaveProperty("role");
        expect(res.body.data).toHaveProperty("verified");
        expect(res.body.data).toHaveProperty("favorites");
        expect(res.body.data).toHaveProperty("avatar");
        expect(res.body.data).toHaveProperty("username");
        expect(res.body.data).toHaveProperty("bio");
        expect(res.body.data).toHaveProperty("title");
        expect(res.body.data).toHaveProperty("lastName");
        expect(res.body.data).toHaveProperty("firstName");
        expect(res.body.data.firstName).toBe("David");
        expect(res.body.data).toHaveProperty("passwordTokenExpirationDate");
      });
    });
  });
});
