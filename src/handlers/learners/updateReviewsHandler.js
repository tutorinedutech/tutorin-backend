const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const updateReviewsHandler = async (request, h) => {
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

    const classSession = await prisma.class_sessions.findFirst({
      where: {
        learner_id: learnerId,
        tutor_id: parseInt(tutorId),
      },
    });

    if (!classSession) {
      return createResponse(h, 401, 'fail', 'Cannot update reviews on tutors who are not on the learner\'s class session');
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

    if (!review) {
      return createResponse(h, 400, 'fail', 'Learner has never written a review about this tutor');
    }

    review = await prisma.reviews.update({
      where: {
        id: review.id,
        learner_id: learnerId,
        tutor_id: parseInt(tutorId),
      },
      data: {
        rating,
        comment,
      },
    });

    return createResponse(h, 201, 'Success', 'Successfully update a review', review);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Cannot update review due to an internal error');
  }
};

module.exports = updateReviewsHandler;
