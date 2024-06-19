const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const searchPurchaseById = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);
    const { tutorId } = decoded;
    const { purchaseId } = request.params;

    if (!tutorId) {
      return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
    }

    const purchase = await prisma.purchases.findUnique({
      where: {
        id: parseInt(purchaseId),
      },
      include: {
        learner: true,
      },
    });

    return createResponse(h, 200, 'success', 'Interested learner was successfully retrieved', purchase);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Interested learner cannot be retrieved');
  }
};

module.exports = searchPurchaseById;
