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
    handler: signInHandler,
  },
  {
    method: 'POST',
    path: '/signuptutors',
    handler: signUpTutorsHandler,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    method: 'POST',
    path: '/signuplearners',
    handler: signUpLearnersHandler,
  },
];

module.exports = routes;
