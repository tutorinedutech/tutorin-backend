const signInHandler = (request, h) => {
  const { username, password } = request.payload;
  return h.response({
    status: 'Success',
    message: `Hi ${username}! You have successfully signed in`,
  }).code(200);
};

module.exports = signInHandler;
