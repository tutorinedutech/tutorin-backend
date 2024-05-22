const crypto = require('crypto');
const tutors = require('./tutors');

const signUpTutorsHandler = (request, h) => {
  const {
    email,
    username,
    password,
    educationLevel,
    gender,
    domicile,
    languages,
    teachingCriteria,
  } = request.payload;

  if (!email) {
    const response = h.response({
      status: 'fail',
      message: 'Your email is invalid',
    });
    response.code(400);
    return response;
  }

  if (!username) {
    const response = h.response({
      status: 'fail',
      message: 'Username is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!password) {
    const response = h.response({
      status: 'fail',
      message: 'Password is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!educationLevel) {
    const response = h.response({
      status: 'fail',
      message: 'educationLevel is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!gender) {
    const response = h.response({
      status: 'fail',
      message: 'gender is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!domicile) {
    const response = h.response({
      status: 'fail',
      message: 'domicile is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!languages) {
    const response = h.response({
      status: 'fail',
      message: 'languages is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!teachingCriteria) {
    const response = h.response({
      status: 'fail',
      message: 'teachingCriteria is required to create account',
    });
    response.code(400);
    return response;
  }

  const id = crypto.randomUUID();
  const newTutors = {
    id,
    email,
    username,
    password,
    educationLevel,
    gender,
    domicile,
    languages,
    teachingCriteria,
  };

  tutors.push(newTutors);

  const isSuccess = tutors.filter((tutor) => tutor.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'Success',
      message: `Hi ${username}! You have successfully signed up with ${email}`,
      data: {
        tutorId: id,
        username,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Account fail to register',
  }).code(500);
};

module.exports = signUpTutorsHandler;
