const { PrismaClient } = require('@prisma/client');

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

    return h.response({
      status: 'Success',
      data: result,
    }).code(200);
  } catch (error) {
    console.error('Error fetching learners:', error);
    return h.response({
      status: 'Error',
      message: 'Failed to fetch learners',
    }).code(500);
  }
};

module.exports = allLearners;
