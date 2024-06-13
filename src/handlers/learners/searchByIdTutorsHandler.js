const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const searchByIdTutorsHandler = async (request, h) => {
  const { tutorId } = request.params; // Ambil id dari params
  try {
    // Query untuk mendapatkan data tutor berdasarkan id
    const tutor = await prisma.tutors.findUnique({
      where: { id: parseInt(tutorId) },
      select: {
        id: true,
        user_id: true,
        name: true,
        education_level: true,
        gender: true,
        domicile: true,
        languages: true,
        teaching_approach: true,
        learning_method: true,
        profile_picture: true,
        cv: true,
        user: {
          select: {
            username: true,
          },
        },
        availabilities: true,
        reviews: true,
      },
    });
    // Kirim respons dengan data tutor
    return createResponse(h, 200, 'success', 'Data Tutors retrieved successfully', tutor);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error fetching tutor data:', error);
    return createResponse(h, 500, 'error', 'Data tutors cannot retrieved successfully, Internal Server Error');
  }
};

module.exports = searchByIdTutorsHandler;
