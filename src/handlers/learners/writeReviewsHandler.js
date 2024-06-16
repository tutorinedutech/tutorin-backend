const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const writeReviewsHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded;
    const { tutorId } = request.params;

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const {
      rating,
      comment,
    } = request.payload;

    let review = await prisma.reviews.findFirst({
      where: {
        learner_id: learnerId,
        tutor_id: parseInt(tutorId),
      },
    });

    if (review) {
      return createResponse(h, 400, 'fail', 'Learner has written a review for this tutor before');
    }

    review = await prisma.reviews.create({
      data: {
        learner_id: learnerId,
        tutor_id: parseInt(tutorId),
        rating,
        comment,
      },
    });

    return createResponse(h, 201, 'Success', 'Successfully wrote a review', review);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Cannot write review due to an internal error');
  }
};

module.exports = writeReviewsHandler;
