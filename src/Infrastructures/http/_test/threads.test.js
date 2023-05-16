const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthenticationUtilityTestHelper = require("../../../../tests/AuthenticationUtilityTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("POST /threads endpoint", () => {
    it("should response 201 and persisted threads", async () => {
      // Arrange
      const accessToken = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );

      const requestPayload = {
        title: "Sebuah judul thread",
        body: "Isi thread",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const accessToken = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );

      const requestPayload = {
        title: "Ini sebuah judul",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("harus mengirimkan title dan body");
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const accessToken = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );

      const requestPayload = {
        title: "Ini sebuah Judul",
        body: ["Isi thread"],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("title dan body harus string");
    });

    it("should response 400 when title more than 50 character", async () => {
      // Arrange
      const accessToken = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );

      const requestPayload = {
        title:
          "Ini sebuah judul yang sangat panjang sekali sehingga bukan seperti judul lagi yang mana tidak bisa dibaca secara sekilas",
        body: "judulnya panjang kontenya pendek",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "title melebihi batas yang ditentukan"
      );
    });

    it("should response 400 when title unavailable", async () => {
      // Arrange
      const accessToken = await AuthenticationUtilityTestHelper.getAccessToken(
        {}
      );
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const requestPayload = {
        title: "Sebuah judul thread",
        body: "Isi thread",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("judul tidak tersedia");
    });

    it("should response 401 when user not authorized", async () => {
      // Arrange
      const accessToken = "invalid_access_token";

      const requestPayload = {
        title: "Sebuah judul thread",
        body: "Isi thread",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.message).toBeDefined();
      expect(response.statusCode).toEqual(401);
    });
  });

  describe("DELETE /threads/{threadId}", () => {
    it("should get detail thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({
        id: "user-1234",
        username: "netizen",
        fullname: "Netizen",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: "comment-1234",
        owner: "user-1234",
        is_delete: true,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123",
      });

      // Action
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(200);
      await expect(responseJson.status).toEqual("success");
      await expect(responseJson.data.thread).toBeDefined();
    });

    it("should throw error status code 404 when thread not available", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/not-found-thread",
      });

      // Action
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(404);
      await expect(responseJson.status).toEqual("fail");
      await expect(responseJson.message).toEqual("thread tidak ada");
    });
  });
});
