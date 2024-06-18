const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const detailLearningHandler = async (request, h) => {
  try {
    // Dapatkan token dari header Authorization
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { tutorId } = decoded; // Mengambil tutorId dari token
    console.log('Decoded TutorID:', tutorId);

    if (!tutorId) {
      return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
    }

    // Query to fetch tutor's class sessions with related class details, learner's name and username
    const tutorSessions = await prisma.class_sessions.findMany({
      where: {
        tutor_id: tutorId,
      },
      include: {
        classDetails: true, // Include related Class_details
        learner: {
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

    // Transformasi data untuk menyertakan learner information
    const transformedData = tutorSessions.map((session) => ({
      id: session.id,
      learner_id: session.learner_id,
      tutor_id: session.tutor_id,
      sessions: session.sessions,
      subject: session.subject,
      nameLearner: session.learner.name,
      usernameLearner: session.learner.user.username,
      classDetails: session.classDetails,
    }));

    return h.response({
      status: 'success',
      message: 'Tutor sessions fetched successfully',
      data: transformedData,
    }).code(200);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching tutor sessions', { error: error.message });
  }
};

module.exports = detailLearningHandler;
