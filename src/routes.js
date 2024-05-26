const { signInHandler, signUpTutorsHandler, signUpLearnersHandler } = require('./handlers/mainHandler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => h.response({
      status: 'Success',
      message: 'Hello World!',
    }).code(200),
  },
  {
    method: 'POST',
    path: '/signin',
    options: {
      auth: false,
    },
    handler: signInHandler,
  },
  {
    method: 'POST',
    path: '/signuptutors',
    options: {
      auth: false,
    },
    handler: signUpTutorsHandler,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 2 * 1024 * 1024, // 2 MB limit
      },
    },
  },
  {
    method: 'POST',
    path: '/signuplearners',
    options: {
      auth: false,
    },
    handler: signUpLearnersHandler,
  },
];

module.exports = routes;
