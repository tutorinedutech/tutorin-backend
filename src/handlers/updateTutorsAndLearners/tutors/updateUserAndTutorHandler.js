const { PrismaClient } = require('@prisma/client');
const Bcrypt = require('bcrypt');
const {
  uploadKtp,
  uploadProfilePicture,
  uploadCv,
} = require('../../uploadFileToGCS');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const updateUserAndTutor = async (request, h) => {
  const { id } = request.params;
  const {
    email,
    username,
    password,
    educationLevel,
    phoneNumber,
    domicile,
    languages,
    subjects,
    teachingCriteria,
    rekeningNumber,
    availability,
    studiedMethod,
    ktp,
    profilePicture,
    cv,
  } = request.payload;
  try {
    // Periksa apakah email atau username sudah ada di database selain dari user yang sedang diupdate
    const emailExists = await prisma.users.findFirst({
      where: {
        email,
        id: { not: parseInt(id) },
      },
    });

    if (emailExists) {
      return h.response({
        status: 'fail',
        message: 'Email already exists',
      }).code(400);
    }

    const usernameExists = await prisma.users.findFirst({
      where: {
        username,
        id: { not: parseInt(id) },
      },
    });

    if (usernameExists) {
      return h.response({
        status: 'fail',
        message: 'Username already exists',
      }).code(400);
    }

    // Periksa apakah password ada, jika ada, hash password baru
    let hashedPassword = null;
    if (password) {
      hashedPassword = await Bcrypt.hash(password, 10);
    }

    // Upload file ke Google Cloud Storage dan dapatkan URLnya
    let ktpUrl = null;
    if (ktp) {
      ktpUrl = await uploadKtp(ktp);
    } else {
      // Jika KTP tidak diisi, gunakan nilai KTP yang sudah ada di database
      const tutor = await prisma.tutors.findFirst({
        where: { user_id: parseInt(id) },
      });
      if (tutor) {
        ktpUrl = tutor.ktp; // Gunakan nilai KTP yang sudah ada di database
      }
    }

    // Upload file profilepicture Google Cloud Storage dan dapatkan URLnya
    let profilePictureUrl = null;
    if (profilePicture) {
      profilePictureUrl = await uploadProfilePicture(profilePicture);
    } else {
      // Jika KTP tidak diisi, gunakan nilai KTP yang sudah ada di database
      const tutor = await prisma.tutors.findFirst({
        where: { user_id: parseInt(id) },
      });
      if (tutor) {
        profilePictureUrl = tutor.profile_picture; // Gunakan nilai KTP yang sudah ada di database
      }
    }

    // Upload file CV Google Cloud Storage dan dapatkan URLnya
    let cvUrl = null;
    if (cv) {
      cvUrl = await uploadCv(cv);
    } else {
      // Jika KTP tidak diisi, gunakan nilai KTP yang sudah ada di database
      const tutor = await prisma.tutors.findFirst({
        where: { user_id: parseInt(id) },
      });
      if (tutor) {
        cvUrl = tutor.cv; // Gunakan nilai KTP yang sudah ada di database
      }
    }

    // Perbarui data dalam tabel users
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        email,
        username,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // Cari baris dalam tabel tutors berdasarkan user_id menggunakan findFirst
    const tutor = await prisma.tutors.findFirst({
      where: { user_id: parseInt(id) },
    });

    // Jika baris dalam tabel tutors ditemukan, perbarui
    let updatedTutor = null;
    if (tutor) {
      updatedTutor = await prisma.tutors.update({
        where: { id: tutor.id }, // Gunakan id unik dari tabel tutors
        data: {
          education_level: educationLevel,
          phone_number: phoneNumber,
          domicile,
          languages,
          subjects,
          teaching_criteria: teachingCriteria,
          rekening_number: rekeningNumber,
          availability,
          studied_method: studiedMethod,
          ...(ktpUrl && { ktp: ktpUrl }),
          ...(profilePictureUrl && { profile_picture: profilePictureUrl }),
          ...(cvUrl && { cv: cvUrl }),

        },
      });
    }

    // Tanggapi dengan data yang diperbarui
    return createResponse(h, 200, 'success', 'User and tutor data updated successfully', { updatedUser, updatedTutor });
  } catch (error) {
    // Tangani kesalahan
    console.error('Error updating user and tutor data:', error);
    return createResponse(h, 500, 'error', 'User and tutor data cannot updated, Internal Server Error');
  }
};

module.exports = updateUserAndTutor;
