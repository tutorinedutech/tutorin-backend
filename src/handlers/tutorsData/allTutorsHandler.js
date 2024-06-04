const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const allTutors = async (request, h) => {
  try {
    const tutors = await prisma.tutors.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const result = tutors.map((tutor) => ({
      username: tutor.user.username,
      profile_picture: tutor.profile_picture,
      subjects: tutor.subjects,
    }));

    return createResponse(h, 200, 'success', 'All data Tutors retrieved successfully', result);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return createResponse(h, 500, 'error', 'Data tutors cannot retrieved successfully, Failed to fetch tutors');
  }
};

module.exports = allTutors;
