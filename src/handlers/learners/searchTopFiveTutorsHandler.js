const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const searchTopFiveTutorsHandler = async (request, h) => {
  try {
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

    return createResponse(h, 200, 'success', 'Tutors fetched successfully', tutors);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while fetching tutors', { error: error.message });
  }
};

module.exports = searchTopFiveTutorsHandler;
