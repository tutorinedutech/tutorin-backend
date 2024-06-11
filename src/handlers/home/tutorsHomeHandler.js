const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const tutorsHomeHandler = async (request, h) => {
  try {
    const { tutorId } = request.params;

    const tutor = await prisma.tutors.findUnique({
      where: { id: parseInt(tutorId) },
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

module.exports = tutorsHomeHandler;
