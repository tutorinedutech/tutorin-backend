// ?upload file unused
// const { Storage } = require('@google-cloud/storage');
// require('dotenv').config();

// const bucketName = process.env.GOOGLE_BUCKET_NAME;
// if (!bucketName) {
//   throw new Error('Bucket name is not set in the environment variables');
// }

// const storage = new Storage({
//   projectId: process.env.GOOGLE_PROJECT_ID,
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

// const bucket = storage.bucket(bucketName);

// const uploadFileToStorage = async (file, fileName) => new Promise((resolve, reject) => {
//   const fileUpload = bucket.file(fileName);

//   const stream = fileUpload.createWriteStream({
//     metadata: {
//       contentType: file.hapi.headers['content-type'], // Mengakses properti headers langsung
//     },
//   });

//   stream.on('error', (error) => {
//     reject(error);
//   });

//   stream.on('finish', async () => {
//     try {
//       await fileUpload.makePublic();
//       const url = `https://storage.googleapis.com/${bucket.name}/data-ktp/${fileUpload.name}`;
//       resolve(url);
//     } catch (err) {
//       reject(err);
//     }
//   });

//   file.on('data', (chunk) => {
//     stream.write(chunk);
//   });

//   file.on('end', () => {
//     stream.end();
//   });
// });

// module.exports = { uploadFileToStorage };


// singup handler unused

// const { PrismaClient } = require('@prisma/client');
// const { uploadFileToStorage } = require('./storage');

// const prisma = new PrismaClient();

// // Error Handler
// const createErrorResponse = (h, message) => {
//   const response = h.response({
//     status: 'fail',
//     message,
//   });
//   response.code(400);
//   return response;
// };

// // Nilai yang didapat dari user
// const signUpTutorsHandler = async (request, h) => {
//   const {
//     email,
//     phoneNumber,
//     username,
//     password,
//     educationLevel,
//     gender,
//     domicile,
//     languages,
//     teachingCriteria,
//     ktp,
//     subjects,
//     rekeningNumber,
//     availability,
//     studiedMethod,
//   } = request.payload;

//   // Melakukan pengecekan jika ada nilai yang kosong
//   const requiredFields = {
//     email,
//     phoneNumber,
//     username,
//     password,
//     educationLevel,
//     gender,
//     domicile,
//     languages,
//     teachingCriteria,
//     ktp,
//     subjects,
//     rekeningNumber,
//     availability,
//     studiedMethod,
//   };

//   for (const [key, value] of Object.entries(requiredFields)) {
//     if (!value) {
//       return createErrorResponse(h, `${key} is required to create account`);
//     }
//   }

//   try {
//     // Memeriksa apakah sudah ada user dengan email, nomor telepon, atau username yang sama
//     const existingUser = await prisma.users.findFirst({
//       where: {
//         OR: [
//           { email },
//           { username },
//         ],
//       },
//     });

//     if (existingUser) {
//       return h.response({
//         status: 'error',
//         message: 'User already registered with the provided email, phone number, or username.',
//       }).code(400);
//     }

//     // Mengunggah foto KTP ke Google Cloud Storage
//     const ktpUrl = await uploadFileToStorage(ktp._data, ktp.hapi.filename);

//     // Menggabungkan array languages menjadi string
//     const languagesString = languages.join(', ');

//     // Menambahkan user baru dan tutor baru dalam satu transaksi
//     const newUser = await prisma.$transaction(async (prisma) => {
//       const createdUser = await prisma.users.create({
//         data: {
//           email,
//           username,
//           password,
//         },
//       });

//       const createdTutor = await prisma.tutors.create({
//         data: {
//           user_id: createdUser.id,
//           education_level: educationLevel,
//           phone_number: phoneNumber,
//           gender,
//           domicile,
//           languages: languagesString,
//           subjects,
//           teaching_criteria: teachingCriteria,
//           rekening_number: rekeningNumber,
//           availability,
//           studied_method: studiedMethod,
//           ktp_url: ktpUrl, // Menyimpan URL foto KTP ke basis data
//         },
//       });

//       return { createdUser, createdTutor };
//     });

//     return h.response({
//       status: 'success',
//       message: 'Tutor registered successfully.',
//       data: {
//         tutorEmail: newUser.createdUser.email,
//         username: newUser.createdUser.username,
//       },
//     }).code(201);
//   } catch (error) {
//     console.error(error);
//     return h.response({
//       status: 'error',
//       message: 'Failed to register tutor due to an internal error.',
//     }).code(500);
//   }
// };

// module.exports = signUpTutorsHandler;
