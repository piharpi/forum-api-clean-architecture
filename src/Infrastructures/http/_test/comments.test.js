const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationUtilityTestHelper = require('../../../../tests/AuthenticationUtilityTestHelper.js')
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 201 and persisted comments', async () => {
    // Arrange
    const threadAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
    const commentAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

    const server = await createServer(container);

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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      headers: {
        Authorization: `Bearer ${commentAuthorAccessToken}`
      },
      payload: {
        content: 'sebuah komentar',
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toBeDefined();
  });

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    const threadAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
    const commentAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

    const server = await createServer(container);

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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      headers: {
        Authorization: `Bearer ${commentAuthorAccessToken}`
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
    const commentAuthorAccessToken = await AuthenticationUtilityTestHelper.getAccessToken({ username: 'dummy_comment', fullname: 'Netizen Indo' });

    const server = await createServer(container);

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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      headers: {
        Authorization: `Bearer ${commentAuthorAccessToken}`
      },
      payload: {
        content: true,
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
    const commentAuthorAccessToken = 'invalid_access_token';

    const server = await createServer(container);

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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      headers: {
        Authorization: `Bearer ${commentAuthorAccessToken}`
      },
      payload: {
        content: true,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.message).toBeDefined();
    expect(response.statusCode).toEqual(401);
  });

  it('should response 404 when thread id is not valid', async () => {
    // Arrange
    const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads/not_found_thread_id/comments',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        content: 'sebuah komentar'
      }
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('thread tidak ada');
  });
});
