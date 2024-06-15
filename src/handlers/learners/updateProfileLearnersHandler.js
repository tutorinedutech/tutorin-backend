const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const Bcrypt = require('bcrypt');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const updateProfileLearnersHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);
    const { learnerId } = decoded;

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const {
      email,
      username,
      password,
      name,
      phoneNumber,
      educationLevel,
      domicile,
    } = request.payload;

    // Ambil data learner dari database menggunakan id dari token
    const currentLearner = await prisma.learners.findUnique({
      where: { id: learnerId }, // Menggunakan id dari token
      include: {
        user: true, // Mengambil data user juga
      },
    });

    if (!currentLearner) {
      return createResponse(h, 404, 'fail', `Learner's username: ${username} and email: ${email} is not found`);
    }

    // Gunakan nilai yang ada jika input kosong
    const newName = name || currentLearner.name;
    const newEmail = email || currentLearner.user.email;
    const newUsername = username || currentLearner.user.username;

    // Periksa apakah email atau username sudah ada di database selain dari learner yang sedang diupdate
    const emailExists = await prisma.users.findFirst({
      where: {
        email: newEmail,
        id: { not: currentLearner.user_id },
      },
    });

    if (emailExists) {
      return createResponse(h, 400, 'fail', 'Email already exists');
    }

    const usernameExists = await prisma.users.findFirst({
      where: {
        username: newUsername,
        id: { not: currentLearner.user_id },
      },
    });

    if (usernameExists) {
      return createResponse(h, 400, 'fail', 'Username already exists');
    }

    // Periksa apakah password ada, jika ada, hash password baru
    let hashedPassword = null;
    if (password) {
      hashedPassword = await Bcrypt.hash(password, 10);
    }

    // Perbarui data dalam tabel users
    await prisma.users.update({
      where: { id: currentLearner.user_id }, // Menggunakan user_id dari learner
      data: {
        email: newEmail,
        username: newUsername,
        // Jika password ada, masukkan hashedPassword
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // Perbarui data dalam tabel learners
    await prisma.learners.update({
      where: { id: learnerId },
      data: {
        name: newName,
        education_level: educationLevel || currentLearner.education_level,
        phone_number: phoneNumber || currentLearner.phone_number,
        domicile: domicile || currentLearner.domicile,
      },
    });

    const updatedLearner = await prisma.learners.findUnique({
      where: { id: learnerId }, // Menggunakan id dari token
      include: {
        user: true, // Mengambil data user juga
      },
    });

    // Tanggapi dengan data yang diperbarui
    return createResponse(h, 200, 'success', 'User and learner data updated successfully', updatedLearner);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error updating user and learner data:', error);
    return createResponse(h, 500, 'error', `User and learner data cannot be updated: ${error.message}`);
  }
};

module.exports = updateProfileLearnersHandler;
