const tutors = require('./tutors');

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
const signUpTutorsHandler = (request, h) => {
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
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return createErrorResponse(h, `${key} is required to create account`);
    }
  }

  // Nilai kembalian yang didapat
  const newTutors = {
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
  };

  // Memeriksa apakah sudah ada tutor dengan email, nomor telepon, atau username yang sama
  const isDuplicate = tutors.some((tutor) => tutor.email === email || tutor.phoneNumber === phoneNumber || tutor.username === username);

  if (isDuplicate) {
    return h.response({
      status: 'error',
      message: 'tutor already registered with the provided email, phone number, or username.',
    }).code(400);
  }

  // Menambahkan tutor baru ke array
  tutors.push(newTutors);

  // Memeriksa apakah tutor berhasil ditambahkan
  const isSuccess = tutors.some((tutor) => tutor.email === email);

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'tutor registered successfully.',
      data: {
        tutorEmail: email,
        username,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'failed to register tutor due to an internal error.',
  }).code(500);
};

module.exports = signUpTutorsHandler;
