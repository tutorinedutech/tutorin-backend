const { signInHandler, signUpHandler } = require('./handler');

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
    path: '/signup',
    handler: signUpHandler,
  },
];

module.exports = routes;
