const { PrismaClient } = require('@prisma/client');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GOOGLE_BUCKET_NAME;

// Error Handler
const createErrorResponse = (h, message) => {
  const response = h.response({
    status: 'fail',
    message,
  });
  response.code(400);
  return response;
};

// fungsi untuk upload ktp
const uploadKtpToGCS = async (ktpFile) => {
  try {
    const bucket = storage.bucket(bucketName);
    const folderName = 'arsip-ktp'; // Nama folder untuk menyimpan KTP di GCS
    const fileName = `${folderName}/ktp_${uuidv4()}.${ktpFile.hapi.filename.split('.').pop()}`; // Generate unique filename within the folder
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: ktpFile.hapi.headers['content-type'],
      },
    });

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
      ktpFile.pipe(stream);
    });

    const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return gcsUrl;
  } catch (error) {
    console.error('Error uploading KTP to GCS:', error);
    throw error;
  }
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
    // ktp,
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

    // Upload KTP to GCS
    let ktpUrl = null;
    if (ktp) {
      ktpUrl = await uploadKtpToGCS(ktp);
    }

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
          ktp: ktpUrl, // save the KTP URL in the database
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
