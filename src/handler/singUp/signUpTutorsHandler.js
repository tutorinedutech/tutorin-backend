const crypto = require('crypto');
const tutors = require('./tutors');

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

  if (!email) {
    const response = h.response({
      status: 'fail',
      message: 'Your email is invalid',
    });
    response.code(400);
    return response;
  }

  if (!phoneNumber) {
    const response = h.response({
      status: 'fail',
      message: 'phoneNumber is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!username) {
    const response = h.response({
      status: 'fail',
      message: 'Username is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!password) {
    const response = h.response({
      status: 'fail',
      message: 'Password is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!educationLevel) {
    const response = h.response({
      status: 'fail',
      message: 'educationLevel is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!gender) {
    const response = h.response({
      status: 'fail',
      message: 'gender is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!domicile) {
    const response = h.response({
      status: 'fail',
      message: 'domicile is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!languages) {
    const response = h.response({
      status: 'fail',
      message: 'languages is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!teachingCriteria) {
    const response = h.response({
      status: 'fail',
      message: 'teachingCriteria is required to create account',
    });
    response.code(400);
    return response;
  }

  if (!ktp) {
    const response = h.response({
      status: 'fail',
      message: 'ktp is required to create account',
    });
    response.code(400);
    return response;
  }

  // Validasi semua bidang yang diperlukan
  if (!email || !phoneNumber || !username || !password || !educationLevel || !gender || !domicile || !languages || !teachingCriteria || !ktp) {
    return h.response({
      status: 'error',
      message: 'validation error: some fields are missing or invalid.',
    }).code(400);
  }

  const id = crypto.randomUUID();
  const newTutors = {
    id,
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
  const isSuccess = tutors.some((tutor) => tutor.id === id);

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'tutor registered successfully.',
      data: {
        tutorId: id,
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
