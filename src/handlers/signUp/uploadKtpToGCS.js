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

module.exports = uploadKtpToGCS;
