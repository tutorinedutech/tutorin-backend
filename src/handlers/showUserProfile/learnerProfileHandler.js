const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const learnerProfileHandler = async (request, h) => {
  try {
    // Dapatkan token dari header Authorization
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded; // Mengambil learnerId dari token
    console.log('Decoded LearnerID:', learnerId);

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const tutor = await prisma.learners.findUnique({
      where: { id: learnerId },
      include: {
        user: true,
      },
    });

    if (!tutor) {
      return createResponse(h, 404, 'error', 'Tutor not found');
    }

    return createResponse(h, 200, 'success', 'Tutor profile fetched successfully', tutor);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching the tutor profile', { error: error.message });
  }
};

module.exports = learnerProfileHandler;
