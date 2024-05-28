const { PrismaClient } = require('@prisma/client');

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
            education_level: true,
            gender: true,
            domicile: true,
          },
        },
      },
    });
      // Kirim respons dengan data Learners
    return h.response({
      status: 'Success',
      message: 'Data learner retrieved successfully',
      data: user,
    }).code(200);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error fetching learner data:', error);
    return h.response({
      status: 'error',
      message: 'Internal Server Error',
      data: {},
    }).code(500);
  }
};

module.exports = idLearners;
