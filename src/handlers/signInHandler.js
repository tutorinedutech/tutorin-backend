require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
const createResponse = require('../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const signInHandler = async (request, h) => {
  const { username, password } = request.payload;

  const requiredFields = {
    username,
    password,
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return createResponse(h, 400, 'fail', `${key} is required to login`);
    }
  }

  const user = await prisma.users.findFirst({
    where: { username },
  });

  if (!user || !(await Bcrypt.compare(password, user.password))) {
    return createResponse(h, 401, 'fail', 'Invalid username or password');
  }

  const tutor = await prisma.tutors.findFirst({
    where: { user_id: parseInt(user.id) },
  });

  if (tutor) {
    const token = JWT.sign({ id: user.id, tutorId: tutor.id, username: user.username }, secret, { algorithm: 'HS256', expiresIn: '1d' });
    return createResponse(h, 200, 'success', 'User has successfully logged in', {
      id: user.id,
      tutorId: tutor.id,
      username: user.username,
      token,
    });
  }

  const learner = await prisma.learners.findFirst({
    where: { user_id: parseInt(user.id) },
  });

  const token = JWT.sign({ id: user.id, learnerId: learner.id, username: user.username }, secret, { algorithm: 'HS256', expiresIn: '1d' });
  return createResponse(h, 200, 'success', 'User has successfully logged in', {
    id: user.id,
    learnerId: learner.id,
    username: user.username,
    token,
  });
};

module.exports = signInHandler;
