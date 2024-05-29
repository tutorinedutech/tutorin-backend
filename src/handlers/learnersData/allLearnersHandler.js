const { PrismaClient } = require('@prisma/client');
const createResponse = require('../createResponse');

const prisma = new PrismaClient();

const allLearners = async (request, h) => {
  try {
    const learners = await prisma.learners.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const result = learners.map((learner) => ({
      username: learner.user.username,
      profile_picture: learner.profile_picture,
      education_level: learner.education_level,
    }));

    return createResponse(h, 200, 'success', 'All data learners retrieved successfully', result);
  } catch (error) {
    console.error('Error fetching learners:', error);
    return createResponse(h, 500, 'error', 'Data learners cannot retrieved successfully, Failed to fetch learners');
  }
};

module.exports = allLearners;
