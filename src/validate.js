const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// validate JWT token
const validate = async (decoded, request) => {
  // check whether the token is blacklisted
  const token = request.headers.authorization.split(' ')[1];

  const blacklistedToken = await prisma.blacklist_token.findUnique({
    where: { token },
  });

  if (blacklistedToken) {
    return { isValid: false };
  }

  const user = await prisma.users.findUnique({
    where: { id: decoded.id },
  });

  if (user) {
    return { isValid: true };
  }
  return { isValid: false };
};

module.exports = validate;
