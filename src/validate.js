const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// validate JWT token
const validate = async (decoded) => {
  const user = await prisma.users.findUnique({
    where: { id: decoded.id },
  });

  if (user) {
    return { isValid: true };
  }
  return { isValid: false };
};

module.exports = validate;
