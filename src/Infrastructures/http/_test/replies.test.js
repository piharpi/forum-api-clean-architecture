const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationUtilityTestHelper = require('../../../../tests/AuthenticationUtilityTestHelper.js');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const container = require('../../container');
const createServer = require('../createServer');

describe('replies test', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies endpoint', function () {

    it('should response 201 and persisted comments', async () => {
      // Arrange
      const threadAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: 'Sebuah judul thread',
          body: 'Isi thread',
        },
      });

      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`
        },
        payload: {
          content: 'sebuah komentar',
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`
        },
        payload: {
          content: 'sebuah balasan',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual('sebuah balasan');
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const threadAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: 'Sebuah judul thread',
          body: 'Isi thread',
        },
      });

      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`
        },
        payload: {
          content: 'sebuah komentar',
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`
        },
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const threadAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: 'Sebuah judul thread',
          body: 'Isi thread',
        },
      });

      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`
        },
        payload: {
          content: 'sebuah komentar',
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`
        },
        payload: {
          content: [],
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });

    it('should response 401 when user not authorized', async () => {
      // Arrange
      const threadAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
      const guestAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

      const server = await createServer(container);

      // create thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${threadAuthorAccessToken}`,
        },
        payload: {
          title: 'Sebuah judul thread',
          body: 'Isi thread',
        },
      });

      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      // create comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${guestAuthorAccessToken}`
        },
        payload: {
          content: 'sebuah komentar',
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer invalid_access_token`
        },
        payload: {
          content: 'sebuah balasan',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.message).toBeDefined();
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread or commment id is not valid', async () => {
      // Arrange
      const AccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});

      const server = await createServer(container);

      const addedComment = {
        id: 'xxxx',
      }

      const addedThread = {
        id: 'xxx',
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        headers: {
          Authorization: `Bearer ${AccessToken}`
        },
        payload: {
          content: 'sebuah balasan',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });
  });
});


// TODO : create test case