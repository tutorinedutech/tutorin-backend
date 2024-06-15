const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const homeTutorsHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);
    const { tutorId } = decoded;

    if (!tutorId) {
      return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
    }

    const tutor = await prisma.tutors.findUnique({
      where: { id: tutorId },
      select: {
        id: true,
        user_id: true,
        name: true,
        profile_picture: true,
        user: {
          select: {
            username: true,
          },
        },
        reviews: true,
        classSessions: true,
      },
    });

    if (!tutor) {
      return createResponse(h, 404, 'fail', 'Tutor not found');
    }

    const classSessionIds = tutor.classSessions.map((session) => session.id);

    const classDetails = await prisma.class_details.findMany({
      where: {
        class_session_id: {
          in: classSessionIds,
        },
      },
    });

    const result = {
      ...tutor,
      classDetails,
    };

    return createResponse(h, 200, 'success', 'Successfully get tutor data on homepage', result);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Tutor data on the homepage cannot be retrieved');
  }
};

module.exports = homeTutorsHandler;
