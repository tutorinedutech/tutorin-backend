const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const searchTopFiveTutorsHandler = async (request, h) => {
  try {
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

    // Calculate average rating for each tutor
    const tutorsWithRatings = await Promise.all(tutors.map(async (tutor) => {
      const ratings = await prisma.reviews.findMany({
        where: { tutor_id: tutor.id },
        select: { rating: true },
      });

      const totalRatings = ratings.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = ratings.length ? (totalRatings / ratings.length) : 0;
      const formattedRating = parseFloat(averageRating.toFixed(2));

      return {
        ...tutor,
        average_rating: formattedRating,
      };
    }));

    // Sort tutors by average_rating in descending order
    tutorsWithRatings.sort((a, b) => b.average_rating - a.average_rating);

    // Take the top 5 tutors after sorting
    const topFiveTutors = tutorsWithRatings.slice(0, 5);

    return createResponse(h, 200, 'success', 'Tutors fetched successfully', topFiveTutors);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching tutors', { error: error.message });
  }
};

module.exports = searchTopFiveTutorsHandler;
