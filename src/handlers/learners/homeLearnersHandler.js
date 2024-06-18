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

    // Get the tutors
    const tutors = await prisma.tutors.findMany({
      select: {
        id: true,
        user_id: true,
        name: true,
        education_level: true,
        teaching_approach: true,
        profile_picture: true,
        user: {
          select: {
            username: true,
          },
        },
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

    // Calculate average rating for each tutor and fetch subjects
    const tutorsWithRatingsAndSubjects = await Promise.all(tutors.map(async (tutor) => {
      const ratings = await prisma.reviews.findMany({
        where: { tutor_id: tutor.id },
        select: { rating: true },
      });

      const totalRatings = ratings.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = ratings.length ? (totalRatings / ratings.length) : 0;
      const formattedRating = parseFloat(averageRating.toFixed(2));

      const availabilities = await prisma.availabilities.findMany({
        where: { tutor_id: tutor.id },
        select: { subject: true },
      });

      const subjects = availabilities.map((avail) => avail.subject);

      return {
        ...tutor,
        average_rating: formattedRating,
        subjects,
      };
    }));

    // Sort tutors by average_rating in descending order
    tutorsWithRatingsAndSubjects.sort((a, b) => b.average_rating - a.average_rating);

    // Take the top 5 tutors after sorting
    const topFiveTutors = tutorsWithRatingsAndSubjects.slice(0, 5);

    const result = {
      ...learner,
      classDetails,
      topFiveTutors,
    };

    return createResponse(h, 200, 'success', 'Successfully get learner data on homepage', result);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Learner data on the homepage cannot be retrieved');
  }
};

module.exports = homeLearnersHandler;
