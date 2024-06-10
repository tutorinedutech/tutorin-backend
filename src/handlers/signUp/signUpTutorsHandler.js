const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const {
  uploadKtp,
  uploadProfilePicture,
  uploadCv,
} = require('../../uploadFileToGCS');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

// Fungsi untuk memvalidasi field yang diperlukan
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return `${key} is required to create account`;
    }
  }
  return null;
};

// Fungsi untuk mengunggah berkas dengan penanganan kesalahan
const handleFileUpload = async (file, uploadFunction) => {
  try {
    return await uploadFunction(file);
  } catch (error) {
    if (error.code === 400) {
      return { status: 'fail', message: error.message };
    }
    throw error;
  }
};

const signUpTutorsHandler = async (request, h) => {
  try {
    const {
      email,
      username,
      password,
      name,
      educationLevel,
      phoneNumber,
      gender,
      domicile,
      languages,
      teachingApproach,
      ktp,
      accountNumber,
      learningMethod,
      profilePicture,
      cv,
    } = request.payload;

    // Validasi field yang diperlukan
    const requiredFields = {
      email,
      username,
      password,
      name,
      educationLevel,
      phoneNumber,
      gender,
      domicile,
      languages,
      teachingApproach,
      ktp,
      accountNumber,
      learningMethod,
    };

    const validationError = validateFields(requiredFields);
    if (validationError) {
      return createResponse(h, 400, 'fail', validationError);
    }

    // Memeriksa apakah sudah ada user dengan email atau username yang sama
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

    // Mengunggah berkas
    const ktpUrl = await handleFileUpload(ktp, uploadKtp);
    if (ktpUrl.status === 'fail') {
      return createResponse(h, 400, 'fail', ktpUrl.message);
    }

    const profilePicUrl = profilePicture ? await handleFileUpload(profilePicture, uploadProfilePicture) : null;
    if (profilePicUrl && profilePicUrl.status === 'fail') {
      return createResponse(h, 400, 'fail', profilePicUrl.message);
    }

    const cvUrl = cv ? await handleFileUpload(cv, uploadCv) : null;
    if (cvUrl && cvUrl.status === 'fail') {
      return createResponse(h, 400, 'fail', cvUrl.message);
    }

    // Hashing user's password
    const hash = await bcrypt.hash(password, 10);

    // Menambahkan user baru dan tutor baru dalam satu transaksi
    const user = await prisma.users.create({
      data: {
        email,
        username,
        password: hash,
      },
    });

    await prisma.tutors.create({
      data: {
        user_id: user.id,
        name,
        education_level: educationLevel,
        phone_number: phoneNumber,
        gender,
        domicile,
        languages,
        teaching_approach: teachingApproach,
        account_number: accountNumber,
        learning_method: learningMethod,
        ktp: ktpUrl,
        profile_picture: profilePicUrl,
        cv: cvUrl,
      },
    });

    return createResponse(h, 201, 'success', 'Tutor registered successfully', {
      email: user.email,
      username: user.username,
    });

  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'Failed to register tutor due to an internal error');
  }
}

module.exports = signUpTutorsHandler;
