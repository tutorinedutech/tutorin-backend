// const { Storage } = require('@google-cloud/storage');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();
// const storage = new Storage();

// const updateKtpImage = async (request, h) => {
//   const { id } = request.params; // Ambil ID pengguna dari parameter rute
//   const imageFile = request.payload.image; // Ambil file gambar yang diunggah dari payload
//   const bucketName = process.env.GOOGLE_BUCKET_NAME;

//   try {
//     // Unggah file gambar baru ke bucket cloud storage Google dengan folder "arsip-ktp"
//     const [file] = await storage.bucket(bucketName).upload(imageFile.path, {
//       destination: `arsip-ktp/${id}/${imageFile.filename}`,
//     });

//     // Dapatkan URL baru file gambar
//     const imageURL = `https://storage.googleapis.com/${bucketName}/${file.name}`;

//     // Perbarui URL gambar dalam database menggunakan Prisma
//     await prisma.users.update({
//       where: { id: parseInt(id) },
//       data: { profile_picture: imageURL },
//     });

//     // Tanggapi dengan URL gambar baru
//     return h.response({
//       status: 'Success',
//       message: 'KTP image updated successfully',
//       data: { profile_picture: imageURL },
//     }).code(200);
//   } catch (error) {
//     // Tangani kesalahan
//     console.error('Error updating KTP image:', error);
//     return h.response({
//       status: 'error',
//       message: 'Internal Server Error',
//       data: {},
//     }).code(500);
//   }
// };

// module.exports = { updateKtpImage };
// Path: src/handlers/update/updatetoGCS.js
// require('dotenv').config();
// const { Storage } = require('@google-cloud/storage');
// const { format } = require('util');
// const { v4: uuidv4 } = require('uuid');

// const storage = new Storage({
//   projectId: process.env.PROJECT_ID,
//   keyFilename: process.env.KEYFILE_PATH,
// });

// const bucket = storage.bucket(process.env.BUCKET_NAME);

// const uploadFile = async (file, folder, filePrefix) => {
//   const fileId = uuidv4();
//   const fileName = `${filePrefix}_${fileId}`;
//   const gcsFile = bucket.file(`${folder}/${fileName}`);
//   const stream = gcsFile.createWriteStream({
//     metadata: {
//       contentType: file.hapi.headers['content-type'],
//     },
//   });

//   return new Promise((resolve, reject) => {
//     stream.on('error', (err) => reject(err));
//     stream.on('finish', () => {
//       const url = format(`https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`);
//       resolve(url);
//     });
//     file.pipe(stream);
//   });
// };

// module.exports = { bucket, uploadFile };

// Path: src/handlers/update/updatetoGCS.js

require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const allowedFileExtensions = ['png', 'jpg', 'gif', 'pdf'];
const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);

const uploadFile = async (file, folder, filePrefix) => {
  const fileExtension = file.hapi.filename.split('.').pop().toLowerCase();

  if (!allowedFileExtensions.includes(fileExtension)) {
    throw new Error('Invalid file type. Only PNG, JPG, GIF, and PDF files are allowed.');
  }

  const fileId = uuidv4();
  const fileName = `${filePrefix}_${fileId}.${fileExtension}`;
  const gcsFile = bucket.file(`${folder}/${fileName}`);
  const stream = gcsFile.createWriteStream({
    metadata: {
      contentType: file.hapi.headers['content-type'],
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', () => {
      const url = format(`https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`);
      resolve(url);
    });
    file.pipe(stream);
  });
};

module.exports = { bucket, uploadFile };
