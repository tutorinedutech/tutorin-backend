const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const homeLearnersHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);
    const { learnerId } = decoded;

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const learner = await prisma.learners.findUnique({
      where: { id: learnerId },
      select: {
        id: true,
        user_id: true,
        name: true,
        user: {
          select: {
            username: true,
          },
        },
        classSessions: true,
      },
    });

    if (!learner) {
      return createResponse(h, 404, 'fail', 'Learner not found');
    }

    const classSessionIds = learner.classSessions.map((session) => session.id);

    const classDetails = await prisma.class_details.findMany({
      where: {
        class_session_id: {
          in: classSessionIds,
        },
      },
    });

    const result = {
      ...learner,
      classDetails,
    };

    return createResponse(h, 200, 'success', 'Successfully get learner data on homepage', result);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Learner data on the homepage cannot be retrieved');
  }
};

module.exports = homeLearnersHandler;
