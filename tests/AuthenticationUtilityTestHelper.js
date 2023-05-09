const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const AuthenticationUtilityTestHelper  = {
   getAccessToken: async () => {
    const server = await createServer(container);

    // add dummy user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dummy',
        password: 'secret',
        fullname: 'Mahendrata Harpi'
      }
    });

    // get access token
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dummy',
        password: 'secret'
      }
    });

    const { data: { accessToken } } = JSON.parse(responseAuth.payload);

    return accessToken;
  }
}

module.exports = AuthenticationUtilityTestHelper