const {
  signInHandler,
  signUpTutorsHandler,
  signUpLearnersHandler,
  allTutors,
  idTutors,
  allLearners,
  idLearners,
} = require('./handlers/mainHandler');

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
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 2 * 1024 * 1024, // 2 MB limit
      },
    },
    handler: signUpTutorsHandler,
  },
  {
    method: 'POST',
    path: '/signuplearners',
    options: {
      auth: false,
    },
    handler: signUpLearnersHandler,
  },
  {
    method: 'GET',
    path: '/tutors',
    options: {
      auth: false,
    },
    handler: allTutors,
  },
  {
    method: 'GET',
    path: '/tutors/{id}',
    options: {
      auth: false,
    },
    handler: idTutors,
  },
  {
    method: 'GET',
    path: '/learners',
    options: {
      auth: false,
    },
    handler: allLearners,
  },
  {
    method: 'GET',
    path: '/learners/{id}',
    options: {
      auth: false,
    },
    handler: idLearners,
  },
];

module.exports = routes;
