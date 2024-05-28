const { PrismaClient } = require('@prisma/client');

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

    return h.response({
      status: 'Success',
      data: result,
    }).code(200);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return h.response({
      status: 'Error',
      message: 'Failed to fetch tutors',
    }).code(500);
  }
};

module.exports = allTutors;
