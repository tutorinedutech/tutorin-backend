const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const purchasesLearnersHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);
    const { learnerId } = decoded;

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const purchase = await prisma.purchases.findMany({
      where: {
        learner_id: learnerId,
        status: {not: null},
      },
      include: {
        tutor: true,
      }
    });

    return h.response({
      status: 'success',
      message: 'Tutors data that the learner looking for has been successfully retrieved',
      data: purchase
    }).code(200);
  } catch (error) {
    console.log(error)
    return createResponse(h, 500, 'error', 'Tutors data that the learner is looking for cannot be retrieved');
  }
}

module.exports = purchasesLearnersHandler;