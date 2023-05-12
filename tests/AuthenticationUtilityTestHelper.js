const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const AuthenticationUtilityTestHelper  = {
   getAccessToken: async ({ username = 'dummy', password= 'secret', fullname= 'Mahendrata Harpi' }) => {
    const server = await createServer(container);

    // add dummy user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: username,
        password: password,
        fullname: fullname
      }
    });

    // get access token
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: username,
        password: password,
      }
    });

    const { data: { accessToken } } = JSON.parse(responseAuth.payload);

    return accessToken;
  }
}

module.exports = AuthenticationUtilityTestHelper