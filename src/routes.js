const {
  signInHandler,
  signUpTutorsHandler,
  signUpLearnersHandler,
  searchTutorsHandler,
  searchByIdTutorsHandler,
  updateProfileLearnersHandler,
  updateProfileTutorsHandler,
  signOutHandler,
  deleteFileTutorHandler,
  transactionHandler,
  paymentStatusHandler,
  tutorProfileHandler,
  learnerProfileHandler,
  tutorsHomeHandler,
  learnersHomeHandler,
  submitValidation,
  getDetailLearning,
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
    handler: searchTutorsHandler,
  },
  {
    // buat nampilin data tutor by Id (buat nyari tutor nanti di sini)
    method: 'GET',
    path: '/tutors/{tutorId}/search',
    handler: searchByIdTutorsHandler,
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
    },
    handler: updateProfileLearnersHandler,
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
    handler: updateProfileTutorsHandler,
  },
  // untuk menghapus file tutor
  {
    method: 'DELETE',
    path: '/tutors/{tutorId}/profile',
    handler: deleteFileTutorHandler,
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
    options: {
      auth: false,
    },
    handler: paymentStatusHandler,
  },

  {
    method: 'PUT',
    path: '/class-details/{tutorId}/schedules',
    handler: submitValidation,
  },
  {
    method: 'GET',
    path: '/class-details/detail-learning',
    handler: getDetailLearning,
  },
];

module.exports = routes;
