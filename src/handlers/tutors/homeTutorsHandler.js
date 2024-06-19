const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');
const { not } = require('joi');

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
        purchases: {
          where: {
            status: null
          }
        },
        classSessions: {
          select: {
            id: true,
            learner_id: true,
            tutor_id: true,
            sessions: true,
            subject: true,
            learner: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!tutor) {
      return createResponse(h, 404, 'fail', 'Tutor not found');
    }

    // Extracting the ids of classSessions
    const classSessionIds = tutor.classSessions.map((session) => session.id);

    // Fetch class details and add learnerName and subject from classSessions
    const classDetails = await prisma.class_details.findMany({
      where: {
        class_session_id: {
          in: classSessionIds,
        },
      },
    });

    // Create a map for fast lookup of classSessions
    const classSessionMap = tutor.classSessions.reduce((acc, session) => {
      acc[session.id] = session;
      return acc;
    }, {});

    // Adding learnerName and subject to each classDetail using the map
    const classDetailsWithLearnerInfo = classDetails.map((detail) => {
      const classSession = classSessionMap[detail.class_session_id];
      return {
        ...detail,
        learnerName: classSession.learner.name,
        subject: classSession.subject,
      };
    });

    // Calculate average rating for the tutor
    const ratings = await prisma.reviews.findMany({
      where: { tutor_id: tutor.id },
      select: { rating: true },
    });

    const totalRatings = ratings.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = ratings.length ? (totalRatings / ratings.length) : 0;
    const formattedRating = parseFloat(averageRating.toFixed(2));

    // Construct the final result
    const result = {
      ...tutor,
      classDetails: classDetailsWithLearnerInfo,
      average_rating: formattedRating,
    };

    return createResponse(h, 200, 'success', 'Successfully get tutor data on homepage', result);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Tutor data on the homepage cannot be retrieved');
  }
};

module.exports = homeTutorsHandler;
