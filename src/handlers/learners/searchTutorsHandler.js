const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const searchTutorsHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded;

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const {
      educationLevel,
      gender,
      domicile,
      learningMethod,
      language,
      subject,
      day,
      time,
    } = request.payload;

    // Filter availabilities based on provided criteria
    const filter = {
      where: {
        subject,
        day: day ? { in: day } : undefined,
        time: time ? { in: time } : undefined,
        tutor: {
          education_level: educationLevel,
          gender,
          domicile,
          learning_method: learningMethod,
          // Apply filter for languages using 'contains' with case-insensitive comparison
          languages: language ? { contains: language } : undefined,
        },
      },
      select: {
        tutor: {
          select: {
            id: true,
            teaching_approach: true,
          },
        },
      },
    };

    const availabilities = await prisma.availabilities.findMany(filter);

    // Use a Map to store unique tutor IDs
    const uniqueTutors = new Map();
    availabilities.forEach((availability) => {
      const { tutor } = availability;
      if (!uniqueTutors.has(tutor.id)) {
        uniqueTutors.set(tutor.id, tutor);
      }
    });

    // Convert the Map values to an array
    const uniqueTutorsArray = Array.from(uniqueTutors.values());

    return h.response({
      status: 'success',
      message: 'Tutors retrieved successfully',
      data: uniqueTutorsArray,
    }).code(200);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return createResponse(h, 500, 'error', 'Data tutors cannot be retrieved successfully, failed to fetch tutors');
  }
};

module.exports = searchTutorsHandler;
