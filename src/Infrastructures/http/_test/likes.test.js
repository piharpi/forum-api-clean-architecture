const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const AuthenticationUtilityTestHelper = require("../../../../tests/AuthenticationUtilityTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("likes test", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("PUT /threads/{threadId}/comments/{commentId}/likes endpoint", () => {
    it("should response 200 and persisted likes", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const userTokenLike =
        await AuthenticationUtilityTestHelper.getAccessToken({
          username: "dummy_user_a",
          fullname: "User A",
        });

      const server = await createServer(container);

      // Action
      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: {
          Authorization: `Bearer ${userTokenLike}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(likeResponse.payload);
      expect(likeResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 401 when user not authorized", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: {
          Authorization: `Bearer invalid_token`,
        },
      });

      // Assert
      const responseJson = JSON.parse(likeResponse.payload);
      expect(responseJson.message).toBeDefined();
      expect(likeResponse.statusCode).toEqual(401);
    });

    it("should response 404 when thread or comment id is not valid", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const userTokenLike =
        await AuthenticationUtilityTestHelper.getAccessToken({
          username: "dummy_user_a",
          fullname: "User A",
        });

      const server = await createServer(container);

      // Action
      const likeResponse = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: {
          Authorization: `Bearer ${userTokenLike}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(likeResponse.payload);
      expect(likeResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ada");
    });
  });
});
