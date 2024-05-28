const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GOOGLE_BUCKET_NAME;

// fungsi untuk upload ktp
const uploadKtpToGCS = async (ktpFile) => {
  try {
    // Pastikan file adalah PNG, JPG, atau GIF
    const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const contentType = ktpFile.hapi.headers['content-type'];
    const fileExtension = ktpFile.hapi.filename.split('.').pop().toLowerCase();
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validTypes.includes(contentType) || !validExtensions.includes(fileExtension)) {
      const error = new Error('Invalid file type. Only PNG, JPG, and GIF files are allowed.');
      error.code = 400;
      throw error;
    }

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

// fungsi untuk upload ktp
const uploadProfilePictureToGCS = async (profilePictureFile) => {
  try {
    // Pastikan file adalah PNG, JPG, atau GIF
    const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const contentType = profilePictureFile.hapi.headers['content-type'];
    const fileExtension = profilePictureFile.hapi.filename.split('.').pop().toLowerCase();
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validTypes.includes(contentType) || !validExtensions.includes(fileExtension)) {
      const error = new Error('Invalid file type. Only PNG, JPG, and GIF files are allowed.');
      error.code = 400;
      throw error;
    }
    const bucket = storage.bucket(bucketName);
    const folderName = 'arsip-profile-picture'; // Nama folder untuk menyimpan KTP di GCS
    const fileName = `${folderName}/profile-picture_${uuidv4()}.${profilePictureFile.hapi.filename.split('.').pop()}`; // Generate unique filename within the folder
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: profilePictureFile.hapi.headers['content-type'],
      },
    });

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
      profilePictureFile.pipe(stream);
    });

    const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return gcsUrl;
  } catch (error) {
    console.error('Error uploading Profile Picture to GCS:', error);
    throw error;
  }
};

// Fungsi untuk mengunggah CV
const uploadCVToGCS = async (cvFile) => {
  try {
    // Pastikan file adalah PDF
    const isPDF = cvFile.hapi.headers['content-type'] === 'application/pdf';
    const hasPdfExtension = cvFile.hapi.filename.split('.').pop().toLowerCase() === 'pdf';

    if (!isPDF || !hasPdfExtension) {
      const error = new Error('Invalid file type. Only PDF files are allowed.');
      error.code = 400;
      throw error;
    }

    const bucket = storage.bucket(bucketName);
    const folderName = 'arsip-cv'; // Nama folder untuk menyimpan CV di GCS
    const fileName = `${folderName}/cv_${uuidv4()}.pdf`; // Generate unique filename within the folder
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: 'application/pdf', // Explicitly set the content type to PDF
      },
    });

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
      cvFile.pipe(stream);
    });

    const gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return gcsUrl;
  } catch (error) {
    console.error('Error uploading CV to GCS:', error);
    throw error;
  }
};

module.exports = { uploadKtpToGCS, uploadProfilePictureToGCS, uploadCVToGCS };
