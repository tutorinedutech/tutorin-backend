const { PrismaClient } = require('@prisma/client');
const Bcrypt = require('bcrypt');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const updateUserAndLearner = async (request, h) => {
  const { id } = request.params;
  const {
    email, username, password, educationLevel, phoneNumber, domicile,
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

    // Perbarui data dalam tabel users
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        email,
        username,
        // Jika password ada, masukkan hashedPassword
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // Cari baris dalam tabel learners berdasaarkan user_id menggunakan findFirst
    const learner = await prisma.learners.findFirst({
      where: { user_id: parseInt(id) },
    });

    // Jika baris dalam tabel learners ditemukan, perbarui
    let updatedLearner = null;
    if (learner) {
      updatedLearner = await prisma.learners.update({
        where: { id: learner.id }, // Gunakan id unik dari tabel learners
        data: {
          education_level: educationLevel,
          phone_number: phoneNumber,
          domicile,
        },
      });
    }

    // Tanggapi dengan data yang diperbarui
    return createResponse(h, 200, 'success', 'User and learner data updated successfully', { updatedUser, updatedLearner });
  } catch (error) {
    // Tangani kesalahan
    console.error('Error updating user and learner data:', error);
    return createResponse(h, 500, 'error', 'User and learner data cannot updated, Internal Server Error');
  }
};

module.exports = updateUserAndLearner;
