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
  tutorProfileHandler,
  learnerProfileHandler,
  tutorsHomeHandler,
  learnersHomeHandler,
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
    method: 'GET',
    path: '/learners/{learnerId}/home',
    handler: learnersHomeHandler,
  },
  {
    // buat nyari tutor nanti di sini ('/tutors')
    method: 'GET',
    path: '/tutors',
    handler: allTutors,
  },
  {
    // buat nampilin data tutor by Id (buat nyari tutor nanti di sini)
    method: 'GET',
    path: '/tutors/{tutorId}/search',
    handler: idTutors,
  },
  // {
  //   // buat nampilin seluruh data learner? harusnya kaga perlu ada
  //   method: 'GET',
  //   path: '/learners',
  //   handler: allLearners,
  // },
  // buat nampilin data learner by Id (buat nyari learner nanti di sini)
  {
    method: 'GET',
    path: '/learners/{learnerId}/search',
    handler: idLearners,
  },

  // buat nampilin data tutor itu sendiri
  {
    method: 'GET',
    path: '/tutors/my-profile-tutor',
    handler: tutorProfileHandler,
  },

  // buat nampilin data learner itu sendiri
  {
    method: 'GET',
    path: '/learners/my-profile-learner',
    handler: learnerProfileHandler,
  },
  // untuk melakukan update user dan learner
  {
    method: 'PUT',
    path: '/learners/{id}/profile',
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
          name: Joi.string().optional(),
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
  // untuk melakukan update user dan tutor
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
  // untuk menghapus file tutor
  {
    method: 'DELETE',
    path: '/tutors/{tutorId}/profile',
    handler: deleteFileTutorHandler,
  },
  // untuk menghapus pending payments yang sudah expired
  {
    method: 'DELETE',
    path: '/delete-pending-payments',
    handler: deleteOldPendingPayments,
  },
  // untuk melakukan transaksi
  {
    method: 'POST',
    path: '/transactions',
    handler: transactionHandler,
  },
  // untuk mengecek dan menyimpan status pembayaran
  {
    method: 'POST',
    path: '/payment-status',
    handler: paymentStatusHandler,
  },
];

module.exports = routes;
