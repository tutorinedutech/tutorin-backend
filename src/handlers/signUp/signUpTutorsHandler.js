const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { uploadKtpToGCS, uploadProfilePictureToGCS, uploadCVToGCS } = require('./uploadFileToGCS');

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
    cv,
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
      try {
        profilePicUrl = await uploadProfilePictureToGCS(profilePicture);
      } catch (error) {
        if (error.message === 'Invalid file type. Only PNG, JPG, and GIF files are allowed.') {
          return h.response({
            status: 'fail',
            message: error.message,
          }).code(error.code || 400);
        }
        throw error;
      }
    }

    // Upload KTP to GCS
    let ktpUrl = 'You have not upload KTP file already';
    if (ktp && ktp.hapi && ktp.hapi.filename) {
      try {
        ktpUrl = await uploadKtpToGCS(ktp);
      } catch (error) {
        if (error.message === 'Invalid file type. Only PNG, JPG, and GIF files are allowed.') {
          return h.response({
            status: 'fail',
            message: error.message,
          }).code(error.code || 400);
        }
        throw error;
      }
    }

    // Upload CV to GCS
    let cvUrl = 'You have not uploaded a CV file yet';
    if (cv && cv.hapi && cv.hapi.filename) {
      try {
        cvUrl = await uploadCVToGCS(cv);
      } catch (error) {
        if (error.message === 'Invalid file type. Only PDF files are allowed.') {
          return h.response({
            status: 'fail',
            message: error.message,
          }).code(error.code || 400);
        }
        throw error;
      }
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
          ktp: ktpUrl,
          profile_picture: profilePicUrl,
          cv: cvUrl,
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
