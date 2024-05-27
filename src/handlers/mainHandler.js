const signInHandler = require('./signIn/signInHandler');
const signUpTutorsHandler = require('./signUp/signUpTutorsHandler');
const signUpLearnersHandler = require('./signUp/signUpLearnersHandler');
const allTutors = require('./tutorsData/allTutors');
const idTutors = require('./tutorsData/idTutors');
const allLearners = require('./learnersData/allLearners');
const idLearners = require('./learnersData/idLearners');

module.exports = {
  signInHandler,
  signUpTutorsHandler,
  signUpLearnersHandler,
  allTutors,
  idTutors,
  allLearners,
  idLearners,
};
