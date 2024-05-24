const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Error Handler
const createErrorResponse = (h, message) => {
  const response = h.response({
    status: 'fail',
    message,
  });
  response.code(400);
  return response;
};

// Nilai yang didapat dari user
const signUpTutorsHandler = async (request, h) => {
  const {
    email,
    phoneNumber,
    username,
    password,
    educationLevel,
    gender,
    domicile,
    languages,
    teachingCriteria,
    ktp,
    subjects,
    rekeningNumber,
    availability,
    studiedMethod,
  } = request.payload;

  // Melakukan pengecekan jika ada nilai yang kosong
  const requiredFields = {
    email,
    phoneNumber,
    username,
    password,
    educationLevel,
    gender,
    domicile,
    languages,
    teachingCriteria,
    ktp,
    subjects,
    rekeningNumber,
    availability,
    studiedMethod,
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return createErrorResponse(h, `${key} is required to create account`);
    }
  }

  try {
    // Memeriksa apakah sudah ada user dengan email, nomor telepon, atau username yang sama
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return h.response({
        status: 'error',
        message: 'User already registered with the provided email or username.',
      }).code(400);
    }

    // Menggabungkan array languages menjadi string
    const languagesString = languages.join(', ');

    // Menambahkan user baru dan tutor baru dalam satu transaksi
    const newUser = await prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.users.create({
        data: {
          email,
          username,
          password,
        },
      });

      const createdTutor = await prisma.tutors.create({
        data: {
          user_id: createdUser.id,
          education_level: educationLevel,
          phone_number: phoneNumber,
          gender,
          domicile,
          languages: languagesString,
          subjects,
          teaching_criteria: teachingCriteria,
          rekening_number: rekeningNumber,
          availability,
          studied_method: studiedMethod,
        },
      });

      return { createdUser, createdTutor };
    });

    return h.response({
      status: 'success',
      message: 'Tutor registered successfully.',
      data: {
        tutorEmail: newUser.createdUser.email,
        username: newUser.createdUser.username,
      },
    }).code(201);
  } catch (error) {
    console.error(error);
    return h.response({
      status: 'error',
      message: 'Failed to register tutor due to an internal error.',
    }).code(500);
  }
};

module.exports = signUpTutorsHandler;
