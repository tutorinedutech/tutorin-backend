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
  transactionHandler,
  paymentStatusHandler,
  deleteOldPendingPayments,
  tutorsHomeHandler,
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

  // `/tutors/{tutorId}/home`
  {
    method: 'GET',
    path: '/tutors/{tutorId}/home',
    handler: tutorsHomeHandler,
  },
  {
    // buat nyari tutor nanti di sini ('/tutors')
    method: 'GET',
    path: '/tutors',
    handler: allTutors,
  },
  {
    // buat nampilin data tutor pas di klik di pencarian ('/tutors/{tutorId}/profile')
    method: 'GET',
    path: '/tutors/{tutorId}/profile',
    handler: idTutors,
  },
  // {
  //   // buat nampilin seluruh data learner? harusnya kaga perlu ada
  //   method: 'GET',
  //   path: '/learners',
  //   handler: allLearners,
  // },
  {
    // buat nampilin data tutor by ID? ('/learners/{learnerid}/search')
    method: 'GET',
    path: '/learners/{id}',
    handler: idLearners,
  },

  // belum ada endpoint dan handler untuk menampilkan data profile tutor dan learner untuk dirinya sendiri

  // '/tutors/{tutorId}/profile'

  // '/learners/{learnerId}/profile'

  {
    method: 'PUT',
    path: '/learners/{id}',
    options: {
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
        }),
      },
    },
    handler: updateUserAndLearner,
  },
  {
    method: 'PUT',
    path: '/tutors/{tutorId}/profile',
    options: {
      payload: {
        output: 'data', // 'data' untuk menangani JSON, stream bisa tetap untuk multipart
        parse: true,
        allow: ['multipart/form-data', 'application/json'],
        multipart: {
          output: 'stream',
        },
        maxBytes: 2 * 1024 * 1024, // 2 MB limit
      },
    },
    handler: updateUserAndTutor,
  },
  {
    method: 'DELETE',
    path: '/tutors/{tutorId}/profile',
    handler: deleteFileTutorHandler,
  },
  {
    method: 'DELETE',
    path: '/delete-pending-payments',
    handler: deleteOldPendingPayments,
  },
  {
    method: 'POST',
    path: '/transactions',
    handler: transactionHandler,
  },
  {
    method: 'POST',
    path: '/payment-status',
    handler: paymentStatusHandler,
  },
];

module.exports = routes;
