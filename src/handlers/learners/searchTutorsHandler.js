const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const searchTutorsHandler = async (request, h) => {
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

    return createResponse(h, 200, 'success', 'All data Tutors retrieved successfully', tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return createResponse(h, 500, 'error', 'Data tutors cannot retrieved successfully, Failed to fetch tutors');
  }
};

module.exports = searchTutorsHandler;
