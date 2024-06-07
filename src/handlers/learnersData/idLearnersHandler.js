const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const idLearners = async (request, h) => {
  const { id } = request.params; // Ambil id dari params
  try {
    // Query untuk mendapatkan data Learners berdasarkan id
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        username: true,
        learners: {
          select: {
            name: true,
            education_level: true,
            gender: true,
            domicile: true,
          },
        },
      },
    });

    // Kirim respons dengan data Learners
    return createResponse(h, 200, 'success', 'Data learner retrieved successfully', user);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error fetching learner data:', error);
    return createResponse(h, 500, 'error', 'Data learner cannot retrieved successfully, Internal Server Error');
  }
};

module.exports = idLearners;
