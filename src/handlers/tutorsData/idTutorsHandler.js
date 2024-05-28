const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const idTutors = async (request, h) => {
  const { id } = request.params; // Ambil id dari params
  try {
    // Query untuk mendapatkan data tutor berdasarkan id
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        username: true,
        tutors: {
          select: {
            education_level: true,
            gender: true,
            domicile: true,
            languages: true,
            subjects: true,
            teaching_criteria: true,
            availability: true,
            studied_method: true,
            profile_picture: true,
            cv: true,
          },
        },
      },
    });
      // Kirim respons dengan data tutor
    return h.response({
      status: 'Success',
      message: 'Data tutor retrieved successfully',
      data: user,
    }).code(200);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error fetching tutor data:', error);
    return h.response({
      status: 'error',
      message: 'Internal Server Error',
      data: {},
    }).code(500);
  }
};

module.exports = idTutors;
