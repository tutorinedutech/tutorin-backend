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
const deleteFileTutorsHandler = require('./tutors/deleteFileTutorsHandler');
const transactionsHandler = require('./midtrans/transactionsHandler');
const paymentStatusHandler = require('./midtrans/paymentStatusHandler');
const { deleteOldPendingPayments } = require('./midtrans/deleteOldPendingPayments');
const profileTutorsHandler = require('./tutors/profileTutorsHandler');
const profileLearnersHandler = require('./learners/profileLearnersHandler');
const homeTutorsHandler = require('./tutors/homeTutorsHandler');
const homeLearnersHandler = require('./learners/homeLearnersHandler');
const submitValidationHandler = require('./tutors/submitValidationHandler');
const detailLearningHandler = require('./tutors/detailLearningHandler');
const detailTutoringHandler = require('./learners/detailTutoringHandler');
const confirmValidationHandler = require('./learners/confirmValidationHandler');
const searchTopFiveTutorsHandler = require('./learners/searchTopFiveTutorsHandler');

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
  deleteFileTutorsHandler,
  transactionsHandler,
  paymentStatusHandler,
  deleteOldPendingPayments,
  profileTutorsHandler,
  profileLearnersHandler,
  homeTutorsHandler,
  homeLearnersHandler,
  submitValidationHandler,
  confirmValidationHandler,
  detailLearningHandler,
  detailTutoringHandler,
  searchTopFiveTutorsHandler,
};
