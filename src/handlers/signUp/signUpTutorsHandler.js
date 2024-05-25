const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const uploadKtpToGCS = require('./uploadKtpToGCS');
const uploadProfilePictureToGCS = require('./uploadProfilePictureToGCS')

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
    profilePicture,
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
        message: 'User already registered with the provided email, phone number, or username.',
      }).code(400);
    }

    // Menggabungkan array languages menjadi string
    const languagesString = Array.isArray(languages) ? languages.join(', ') : '';

    // Upload Profile Picture to GCS
    let profilePicUrl = 'https://storage.googleapis.com/simpan-data-gambar-user/arsip-profile-picture/profile-picture_default.png'; // default profile picture
    if (profilePicture && profilePicture.hapi && profilePicture.hapi.filename) {
      profilePicUrl = await uploadProfilePictureToGCS(profilePicture);
    }

    // Upload KTP to GCS
    let ktpUrl = 'You have not upload KTP file already';
    if (ktp && ktp.hapi && ktp.hapi.filename) {
      ktpUrl = await uploadKtpToGCS(ktp);
    }

    // Hashing user's password
    const hash = await bcrypt.hash(password, 10);

    // Menambahkan user baru dan tutor baru dalam satu transaksi
    const newUser = await prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.users.create({
        data: {
          email,
          username,
          password: hash,
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
          ktp: ktpUrl, // save the KTP URL in the database
          profile_picture: profilePicUrl,
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
