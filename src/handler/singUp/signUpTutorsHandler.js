const signUpTutorsHandler = (request, h) => {
  const { email, username, password } = request.payload;
  return h.response({
    status: 'Success',
    message: `Hi ${username}! You have successfully signed up with ${email}`,
  }).code(201);
};

module.exports = signUpTutorsHandler;
