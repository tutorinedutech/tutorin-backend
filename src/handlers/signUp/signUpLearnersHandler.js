const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const signUpLearnersHandler = async (request, h) => {
  const {
    email,
    username,
    password,
    name,
    educationLevel,
    phoneNumber,
    gender,
    domicile,
  } = request.payload;

  try {
    // Checks for empty data in the payload
    const requiredFields = {
      email,
      username,
      password,
      name,
      educationLevel,
      phoneNumber,
      gender,
      domicile,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return createResponse(h, 400, 'fail', `${key} is required to create account`);
      }
    }

    // Check whether student data is already registered
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return createResponse(h, 400, 'fail', 'User already registered with the provided email or username');
    }

    // Hashing user's password
    const hash = await bcrypt.hash(password, 10);

    // Save user's data to the database
    const user = await prisma.users.create({
      data: {
        email,
        username,
        password: hash,
      },
    });

    await prisma.learners.create({
      data: {
        user_id: user.id,
        name,
        education_level: educationLevel,
        phone_number: phoneNumber,
        gender,
        domicile,
      },
    });

    return createResponse(h, 201, 'success', 'Learner registered successfully', { email: user.email, username: user.username });
  } catch (error) {
    return createResponse(h, 500, 'error', 'Failed to register learner due to an internal error', error);
  }
};

module.exports = signUpLearnersHandler;
