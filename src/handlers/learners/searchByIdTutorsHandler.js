const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const searchByIdTutorsHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded;
    const { tutorId } = request.params; // Ambil id dari params

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

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

    const ratings = await prisma.reviews.findMany({
      where: { tutor_id: tutor.id },
      select: { rating: true },
    });

    const totalRatings = ratings.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = ratings.length ? (totalRatings / ratings.length) : 0;
    const formattedRating = parseFloat(averageRating.toFixed(2));

    // Kirim respons dengan data tutor
    return createResponse(h, 200, 'success', 'Data Tutors retrieved successfully', { ...tutor, average_rating: formattedRating });
  } catch (error) {
    // Tangani kesalahan
    console.error('Error fetching tutor data:', error);
    return createResponse(h, 500, 'error', 'Data tutors cannot retrieved successfully, Internal Server Error');
  }
};

module.exports = searchByIdTutorsHandler;
