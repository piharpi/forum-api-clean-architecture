const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationUtilityTestHelper = require("../../../../tests/AuthenticationUtilityTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("replies test", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("POST /threads/{threadId}/comments/{commentId}/replies endpoint", () => {
    it("should response 201 and persisted replies", async () => {
      // Arrange
      const threadAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({
          username: "dummy_comment",
          fullname: "Netizen Indo",
        });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: "Sebuah judul thread",
          body: "Isi thread",
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`,
        },
        payload: {
          content: "sebuah komentar",
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          content: "sebuah balasan",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual("sebuah balasan");
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const threadAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({
          username: "dummy_comment",
          fullname: "Netizen Indo",
        });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: "Sebuah judul thread",
          body: "Isi thread",
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`,
        },
        payload: {
          content: "sebuah komentar",
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("harus mengirimkan content");
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const threadAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({
          username: "dummy_comment",
          fullname: "Netizen Indo",
        });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: "Sebuah judul thread",
          body: "Isi thread",
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`,
        },
        payload: {
          content: "sebuah komentar",
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          content: [],
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("content harus string");
    });

    it("should response 401 when user not authorized", async () => {
      // Arrange
      const threadAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({
          username: "dummy_comment",
          fullname: "Netizen Indo",
        });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: "Sebuah judul thread",
          body: "Isi thread",
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`,
        },
        payload: {
          content: "sebuah komentar",
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer invalid_access_token`,
        },
        payload: {
          content: "sebuah balasan",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.message).toBeDefined();
      expect(response.statusCode).toEqual(401);
    });

    it("should response 404 when thread or comment id is not valid", async () => {
      // Arrange
      const AccessToken = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );

      const server = await createServer(container);

      const addedComment = {
        id: "xxxx",
      };

      const addedThread = {
        id: "xxx",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
        payload: {
          content: "sebuah balasan",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ada");
    });
  });

  describe("DELETE /threads/{threadId}/comments/commentId/replies/{replyId} endpoint", () => {
    it("should response 200 and delete reply success", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const repliesAuthorAccessToken =
        await AuthenticationUtilityTestHelper.getAccessToken({});

      const server = await createServer(container);

      const replyResponse = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        headers: {
          Authorization: `Bearer ${repliesAuthorAccessToken}`,
        },
        payload: {
          content: "ini balasan komentar",
        },
      });

      const {
        data: { addedReply },
      } = JSON.parse(replyResponse.payload);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/${addedReply.id}`,
        headers: {
          Authorization: `Bearer ${repliesAuthorAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const commentData = await RepliesTableTestHelper.findRepliesById(
        addedReply.id
      );
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(commentData[0].is_delete).toEqual(true);
    });

    it("should response 401 when user not authorized", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.message).toBeDefined();
      expect(response.statusCode).toEqual(401);
    });

    it("should response 404 when reply id is not valid", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({
        username: "dummy_comment",
        fullname: "Netizen Indo",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/xxxxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("reply tidak ada");
    });

    it("should response 403 when user delete unowned reply", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const InvalidUser = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${InvalidUser}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "anda tidak berhak mengakses resource ini"
      );
    });
  });
});
