const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const detailClassSessionHandler = async (request, h) => {
  try {
    const { classSessionId } = request.params;

    // Query untuk mendapatkan detail class_session berdasarkan class_session_id
    const classSession = await prisma.class_sessions.findUnique({
      where: {
        id: classSessionId,
      },
      include: {
        classDetails: true,
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!classSession) {
      return createResponse(h, 404, 'error', 'Class session not found');
    }

    // Format output sesuai kebutuhan
    const response = {
      id: classSession.id,
      learner_id: classSession.learner_id,
      tutor_id: classSession.tutor_id,
      sessions: classSession.sessions,
      subject: classSession.subject,
      nameTutor: classSession.tutor.name,
      profilePictureTutor: classSession.tutor.profile_picture,
      usernameTutor: classSession.tutor.user.username,
      classDetails: classSession.classDetails,
    };

    return createResponse(h, 200, 'success', 'Class session details fetched successfully', response);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching class session details', { error: error.message });
  }
};

module.exports = detailClassSessionHandler;
