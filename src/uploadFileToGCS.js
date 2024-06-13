const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

// config jika dijalankan di local atau vm
// const storage = new Storage({
//   projectId: process.env.GOOGLE_PROJECT_ID,
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

let storage = null;

if (process.env.NODE_ENV !== 'production') {
  storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
} else {
  storage = new Storage();
}

const bucketName = process.env.GOOGLE_BUCKET_NAME;

// Fungsi umum untuk mengunggah berkas ke GCS
const uploadFile = async (file, folderName, validTypes, validExtensions) => {
  const contentType = file.hapi.headers['content-type'];
  const fileExtension = file.hapi.filename.split('.').pop().toLowerCase();

  if (!validTypes.includes(contentType) || !validExtensions.includes(fileExtension)) {
    const error = new Error(`Invalid file type. Only ${validExtensions.join(', ').toUpperCase()} files are allowed.`);
    error.code = 400;
    throw error;
  }

  const bucket = storage.bucket(bucketName);
  const fileName = `${folderName}/${folderName}_${uuidv4()}.${fileExtension}`;
  const gcsFile = bucket.file(fileName);

  const stream = gcsFile.createWriteStream({
    metadata: {
      contentType: file.hapi.headers['content-type'],
    },
  });

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
    file.pipe(stream);
  });

  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};

// Spesifikasikan fungsi upload untuk masing-masing berkas
const uploadKtp = (ktpFile) => uploadFile(ktpFile, 'ktp', ['image/png', 'image/jpeg'], ['png', 'jpg', 'jpeg']);
const uploadProfilePicture = (profilePictureFile) => uploadFile(profilePictureFile, 'profile-picture', ['image/png', 'image/jpeg'], ['png', 'jpg', 'jpeg']);
const uploadCv = (cvFile) => uploadFile(cvFile, 'cv', ['application/pdf'], ['pdf']);

module.exports = {
  uploadKtp,
  uploadProfilePicture,
  uploadCv,
};
