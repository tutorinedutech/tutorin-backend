const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const getDetailLearning = async (request, h) => {
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

    // Query to fetch tutor's class sessions with related class details
    const tutorSessions = await prisma.class_sessions.findMany({
      where: {
        tutor_id: tutorId,
      },
      include: {
        classDetails: true, // Include related Class_details
      },
    });

    return createResponse(h, 200, 'success', 'Tutor sessions fetched successfully', tutorSessions);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching tutor sessions', { error: error.message });
  }
  //   try {
  //     // Dapatkan token dari header Authorization
  //     const { authorization } = request.headers;
  //     if (!authorization) {
  //       return createResponse(h, 401, 'error', 'Authorization header missing');
  //     }

  //     const token = authorization.replace('Bearer ', '');
  //     const decoded = JWT.verify(token, secret);

  //     const { tutorId } = decoded; // Mengambil tutorId dari token
  //     console.log('Decoded TutorID:', tutorId);

  //     if (!tutorId) {
  //       return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
  //     }

  //     // Query to fetch tutor's class sessions with related class details
  //     const tutorSessions = await prisma.class_sessions.findMany({
  //       where: {
  //         tutor_id: tutorId,
  //       },
  //       include: {
  //         classDetails: true, // Include related Class_details
  //       },
  //     });

  //     if (!tutorSessions || tutorSessions.length === 0) {
  //       return createResponse(h, 404, 'error', 'No tutor sessions found');
  //     }

  //     // Return the first tutor session with its details
  //     const responseData = {
  //       id: tutorSessions[0].id,
  //       learner_id: tutorSessions[0].learner_id,
  //       tutor_id: tutorSessions[0].tutor_id,
  //       sessions: tutorSessions[0].sessions,
  //       subject: tutorSessions[0].subject,
  //       classDetails: tutorSessions[0].classDetails,
  //     };

//     return createResponse(h, 200, 'success', 'Tutor sessions fetched successfully', responseData);
//   } catch (error) {
//     console.error(error);
//     return createResponse(h, 500, 'error', 'An error occurred while fetching tutor sessions', { error: error.message });
//   }
};

module.exports = getDetailLearning;
