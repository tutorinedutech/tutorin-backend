const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const signOutHandler = async (request, h) => {
  const token = request.headers.authorization.split(' ')[1];
  await prisma.blacklist_token.create({
    data: { token },
  });
  return createResponse(h, 200, 'success', 'User has successfully logged out');
};

module.exports = signOutHandler;
