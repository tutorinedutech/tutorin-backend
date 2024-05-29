const Joi = require('joi');

const {
  signInHandler,
  signUpTutorsHandler,
  signUpLearnersHandler,
  allTutors,
  idTutors,
  allLearners,
  idLearners,
  updateUserAndLearner,
  updateUserAndTutor,
  signOutHandler,
  deleteFileTutorHandler,
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
    path: '/signout',
    handler: signOutHandler,
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
    handler: allTutors,
  },
  {
    method: 'GET',
    path: '/tutors/{id}',
    handler: idTutors,
  },
  {
    method: 'GET',
    path: '/learners',
    handler: allLearners,
  },
  {
    method: 'GET',
    path: '/learners/{id}',
    handler: idLearners,
  },
  {
    method: 'PUT',
    path: '/learners/{id}',
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required(),
        }),
        payload: Joi.object({
          email: Joi.string().email().optional(),
          username: Joi.string().optional(),
          password: Joi.string().optional(),
          educationLevel: Joi.string().optional(),
          phoneNumber: Joi.string().optional(),
          domicile: Joi.string().optional(),
        }),
      },
    },
    handler: updateUserAndLearner,
  },
  {
    method: 'PUT',
    path: '/tutors/{id}',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 2 * 1024 * 1024, // 2 MB limit
      },
    },
    handler: updateUserAndTutor,
  },
  {
    method: 'DELETE',
    path: '/tutors/{tutorId}',
    handler: deleteFileTutorHandler,
  },
];

module.exports = routes;
