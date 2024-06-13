const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const searchByIdLearnersHandler = async (request, h) => {
  const { learnerId } = request.params; // Ambil learnerId dari params
  try {
    // Query untuk mendapatkan data Learners berdasarkan learnerId
    const learner = await prisma.learners.findUnique({
      where: { id: parseInt(learnerId) },
      select: {
        id: true,
        user_id: true,
        name: true,
        education_level: true,
        gender: true,
        domicile: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!learner) {
      return createResponse(h, 404, 'error', 'Learner not found');
    }

    // Kirim respons dengan data Learners
    return createResponse(h, 200, 'success', 'Data learner retrieved successfully', learner);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error fetching learner data:', error);
    return createResponse(h, 500, 'error', 'Data learner cannot be retrieved successfully, Internal Server Error');
  }
};

module.exports = searchByIdLearnersHandler;
