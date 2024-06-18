const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const detailTutoringHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded;
    console.log('Decoded LearnerID:', learnerId);

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    // Query untuk mendapatkan detail class_sessions yang terkait dengan learnerId
    const learnerSessions = await prisma.class_sessions.findMany({
      where: {
        learner_id: learnerId,
      },
      include: {
        classDetails: true, // Include class details
        tutor: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    // Transformasi data untuk menyertakan tutor information
    const transformedData = learnerSessions.map((session) => ({
      id: session.id,
      learner_id: session.learner_id,
      tutor_id: session.tutor_id,
      sessions: session.sessions,
      subject: session.subject,
      nameTutor: session.tutor.name,
      profilePictureTutor: session.tutor.profile_picture,
      usernameTutor: session.tutor.user.username,
      classDetails: session.classDetails,
    }));

    return h.response({
      status: 'success',
      message: 'Learner sessions fetched successfully',
      data: transformedData, // Ensure the data is an array
    }).code(200);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching learner sessions', { error: error.message });
  }
};

module.exports = detailTutoringHandler;
