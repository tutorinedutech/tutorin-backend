const signInHandler = require('./signInHandler');
const signUpTutorsHandler = require('./tutors/signUpTutorsHandler');
const signUpLearnersHandler = require('./learners/signUpLearnersHandler');
const signOutHandler = require('./signOutHandler');
const searchTutorsHandler = require('./learners/searchTutorsHandler');
const searchByIdTutorsHandler = require('./learners/searchByIdTutorsHandler');
const searchLearnersHandler = require('./tutors/searchLearnersHandler');
const searchByIdLearnersHandler = require('./tutors/searchByIdLearnersHandler');
const updateProfileLearnersHandler = require('./learners/updateProfileLearnersHandler');
const updateProfileTutorsHandler = require('./tutors/updateProfileTutorsHandler');
const deleteFileTutorHandler = require('./tutors/deleteFileTutorsHandler');
const transactionHandler = require('./midtrans/transactionsHandler');
const paymentStatusHandler = require('./midtrans/paymentStatusHandler');
const { deleteOldPendingPayments } = require('./midtrans/deleteOldPendingPayments');
const tutorProfileHandler = require('./tutors/profileTutorsHandler');
const learnerProfileHandler = require('./learners/profileLearnersHandler');
const tutorsHomeHandler = require('./tutors/homeTutorsHandler');
const learnersHomeHandler = require('./learners/homeLearnersHandler');

module.exports = {
  signInHandler,
  signUpTutorsHandler,
  signUpLearnersHandler,
  searchTutorsHandler,
  searchByIdTutorsHandler,
  searchLearnersHandler,
  searchByIdLearnersHandler,
  updateProfileLearnersHandler,
  updateProfileTutorsHandler,
  signOutHandler,
  deleteFileTutorHandler,
  transactionHandler,
  paymentStatusHandler,
  deleteOldPendingPayments,
  tutorProfileHandler,
  learnerProfileHandler,
  tutorsHomeHandler,
  learnersHomeHandler,
};
