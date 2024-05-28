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
  {
    method: 'PUT',
    path: '/learners/{id}',
    options: {
      auth: false,
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
      handler: updateUserAndLearner,
    },
  },
  {
    method: 'PUT',
    path: '/tutors/{id}',
    options: {
      auth: false,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 2 * 1024 * 1024, // 2 MB limit
      },
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
          languages: Joi.string().optional(),
          subjects: Joi.string().optional(),
          teachingCriteria: Joi.string().optional(),
          rekeningNumber: Joi.string().optional(),
          availability: Joi.string().optional(),
          studiedMethod: Joi.string().optional(),
          profile_picture: Joi.any().optional(),
          cv: Joi.any().optional(),
          ktp: Joi.any().optional(),
        }),
      },
    },
    handler: updateUserAndTutor,
  },
];
module.exports = routes;
