const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationUtilityTestHelper = require('../../../../tests/AuthenticationUtilityTestHelper.js')
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 201 and persisted threads', async () => {
    // Arrange
    const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({});

    const requestPayload = {
      title: 'Sebuah judul thread',
      body: 'Isi thread',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
  });

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({});

    const requestPayload = {
      title: 'Ini sebuah judul',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('harus mengirimkan title dan body');
  });

  it('should response 400 when request payload not meet data type specification', async () => {
    // Arrange
    const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({});

    const requestPayload = {
      title: 'Ini sebuah Judul',
      body: ['Isi thread'],
    };
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: { Authorization: `Bearer ${accessToken}`},
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('title dan body harus string');
  });

  it('should response 400 when title more than 50 character', async () => {
    // Arrange
    const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({});

    const requestPayload = {
      title: 'Ini sebuah judul yang sangat panjang sekali sehingga bukan seperti judul lagi yang mana tidak bisa dibaca secara sekilas',
      body: 'judulnya panjang kontenya pendek',
    };
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('title melebihi batas yang ditentukan');
  });

  it('should response 400 when title unavailable', async () => {
    // Arrange
    const accessToken = await AuthenticationUtilityTestHelper.getAccessToken({});
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});

    const requestPayload = {
      title: 'Sebuah judul thread',
      body: 'Isi thread',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('judul tidak tersedia');
  });

  it('should response 401 when user not authorized', async () => {
    // Arrange
    const accessToken = 'invalid_access_token';

    const requestPayload = {
      title: 'Sebuah judul thread',
      body: 'Isi thread',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
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
