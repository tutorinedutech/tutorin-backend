const {
  signInHandler,
  signUpTutorsHandler,
  signUpLearnersHandler,
  searchTutorsHandler,
  searchByIdTutorsHandler,
  updateProfileLearnersHandler,
  updateProfileTutorsHandler,
  signOutHandler,
  deleteFileTutorsHandler,
  transactionsHandler,
  paymentStatusHandler,
  profileTutorsHandler,
  profileLearnersHandler,
  homeTutorsHandler,
  homeLearnersHandler,
  submitValidationHandler,
  confirmValidationHandler,
  detailLearningHandler,
  detailTutoringHandler,
  writeReviewsHandler,
  updateReviewsHandler,
  searchTopFiveTutorsHandler,
  classDetailsByClassSessionIdHandler,
  purchasesListHandler,
  confirmAcceptedLearnerHandler,
} = require('./handlers/mainHandler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (h) => h.response({
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
    path: '/tutors/home',
    handler: homeTutorsHandler,
  },
  {
    method: 'GET',
    path: '/learners/home',
    handler: homeLearnersHandler,
  },
  {
    // buat nyari tutor nanti di sini ('/tutors')
    method: 'POST',
    path: '/tutors',
    handler: searchTutorsHandler,
  },
  {
    // buat nampilin data tutor by Id (buat nyari tutor nanti di sini)
    method: 'GET',
    path: '/tutors/{tutorId}',
    handler: searchByIdTutorsHandler,
  },
  // buat nampilin data tutor itu sendiri
  {
    method: 'GET',
    path: '/tutors/my-profile',
    handler: profileTutorsHandler,
  },
  // buat nampilin data learner itu sendiri
  {
    method: 'GET',
    path: '/learners/my-profile',
    handler: profileLearnersHandler,
  },
  // untuk melakukan update user dan tutor
  {
    method: 'PUT',
    path: '/tutors/my-profile',
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
  // untuk melakukan update user dan learner
  {
    method: 'PUT',
    path: '/learners/my-profile',
    handler: updateProfileLearnersHandler,
  },
  // untuk menghapus file tutor
  {
    method: 'DELETE',
    path: '/tutors/my-profile',
    handler: deleteFileTutorsHandler,
  },
  // untuk melakukan transaksi
  {
    method: 'POST',
    path: '/transactions',
    handler: transactionsHandler,
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
  // mendapatkan "detail learning" dari learner yang telah memesan tutors
  {
    method: 'GET',
    path: '/class-details/detail-learning',
    handler: detailLearningHandler,
  },
  // mendapatkan "detail tutoring" dari tutor yang sudah dipesan
  {
    method: 'GET',
    path: '/class-details/detail-tutoring',
    handler: detailTutoringHandler,
  },
  // melakukan update tutor dengan menambahkan file gambar dan lokasi kursus dilaksanakan
  {
    method: 'PUT',
    path: '/class-details/detail-learning/{classDetailsId}',
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
    handler: submitValidationHandler,
  },
  // melakukan update dengan memberikan nilai validate_status = Aprroved.
  {
    method: 'PUT',
    path: '/class-details/detail-tutoring/{classDetailsId}',
    handler: confirmValidationHandler,
  },
  // learner dapat menulis rating dan ulasan tentang tutor
  {
    method: 'POST',
    path: '/tutors/{tutorId}/reviews',
    handler: writeReviewsHandler,
  },
  // learner dapat memperbarui rating dan ulasan yang sudah ditulis tentang tutor
  {
    method: 'PUT',
    path: '/tutors/{tutorId}/reviews',
    handler: updateReviewsHandler,
  },
  // mendapatkan 5 tutor terbaik
  {
    method: 'GET',
    path: '/tutors/top-rated',
    handler: searchTopFiveTutorsHandler,
  },
  // mendapatkan detail class berdasarkan classSessionId
  {
    method: 'GET',
    path: '/class-details/{classSessionId}',
    handler: classDetailsByClassSessionIdHandler,
  },
  // melakukan pencarian tutor yang mau dibeli
  {
    method: 'POST',
    path: '/tutors/purchases',
    handler: purchasesListHandler,
  },
  // melakukan penerimaan learner oleh tutor yang mau dibeli
  {
    method: 'PUT',
    path: '/tutors/purchases/{purchasesId}',
    handler: confirmAcceptedLearnerHandler,
  },
];

module.exports = routes;
