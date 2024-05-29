const signInHandler = require('./signIn/signInHandler');
const signUpTutorsHandler = require('./signUp/signUpTutorsHandler');
const signUpLearnersHandler = require('./signUp/signUpLearnersHandler');
const signOutHandler = require('./signOut/signOutHandler');
const allTutors = require('./tutorsData/allTutorsHandler');
const idTutors = require('./tutorsData/idTutorsHandler');
const allLearners = require('./learnersData/allLearnersHandler');
const idLearners = require('./learnersData/idLearnersHandler');
const updateUserAndLearner = require('./updateTutorsAndLearners/learners/updateUserAndLearnerHandler');
const updateUserAndTutor = require('./updateTutorsAndLearners/tutors/updateUserAndTutorHandler');

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
