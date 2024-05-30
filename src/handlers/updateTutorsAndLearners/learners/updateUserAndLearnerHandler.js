const { PrismaClient } = require('@prisma/client');
const Bcrypt = require('bcrypt');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const updateUserAndLearner = async (request, h) => {
  const { id } = request.params;
  const {
    email,
    username,
    password,
    educationLevel,
    phoneNumber,
    domicile,
  } = request.payload;

  try {
    // Ambil data user dari database untuk mendapatkan nilai saat ini
    const currentUser = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!currentUser) {
      return h.response({
        status: 'fail',
        message: 'User not found',
      }).code(404);
    }

    // Ambil data learner dari database untuk mendapatkan nilai saat ini
    const currentLearner = await prisma.learners.findFirst({
      where: { user_id: parseInt(id) },
    });

    // Gunakan nilai yang ada jika email atau username tidak diberikan
    const newEmail = email || currentUser.email;
    const newUsername = username || currentUser.username;

    // Periksa apakah email atau username sudah ada di database selain dari user yang sedang diupdate
    const emailExists = await prisma.users.findFirst({
      where: {
        email: newEmail,
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
        username: newUsername,
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
        email: newEmail,
        username: newUsername,
        // Jika password ada, masukkan hashedPassword
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // Jika baris dalam tabel learners ditemukan, perbarui
    let updatedLearner = null;
    if (currentLearner) {
      updatedLearner = await prisma.learners.update({
        where: { id: currentLearner.id }, // Gunakan id unik dari tabel learners
        data: {
          education_level: educationLevel || currentLearner.education_level,
          phone_number: phoneNumber || currentLearner.phone_number,
          domicile: domicile || currentLearner.domicile,
        },
      });
    }

    // Tanggapi dengan data yang diperbarui
    return createResponse(h, 200, 'success', 'User and learner data updated successfully', { updatedUser, updatedLearner });
  } catch (error) {
    // Tangani kesalahan
    console.error('Error updating user and learner data:', error);
    return createResponse(h, 500, 'error', 'User and learner data cannot be updated, Internal Server Error');
  }
};

module.exports = updateUserAndLearner;
