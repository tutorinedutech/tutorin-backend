const signInHandler = require('./signIn/signInHandler');
const signUpTutorsHandler = require('./signUp/signUpTutorsHandler');
const signUpLearnersHandler = require('./signUp/signUpLearnersHandler');
const signOutHandler = require('./signOut/signOutHandler');
const allTutors = require('./tutorsData/allTutors');
const idTutors = require('./tutorsData/idTutors');
const allLearners = require('./learnersData/allLearners');
const idLearners = require('./learnersData/idLearners');
const updateUserAndLearner = require('./update/learners/updateUserAndLearner');
const updateUserAndTutor = require('./update/tutors/updateUserAndTutor');

module.exports = {
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
};
