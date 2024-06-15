const JWT = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { Storage } = require('@google-cloud/storage');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

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

const deleteFileTutorsHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);
    const { tutorId } = decoded;

    if (!tutorId) {
      return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
    }

    const { file } = request.query;

    const tutor = await prisma.tutors.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return createResponse(h, 404, 'fail', 'Tutor not found');
    }

    if (file === 'cv') {
      const cvUrl = tutor.cv;
      const parsedUrl = new URL(cvUrl);
      const filePath = parsedUrl.pathname.replace(`/${bucketName}/`, '');

      await storage.bucket(bucketName).file(filePath).delete().catch((err) => {
        console.error(`Failed to delete CV: ${err.message}`);
      });

      await prisma.tutors.update({
        where: { id: tutorId },
        data: { cv: null },
      });

      return createResponse(h, 200, 'success', 'CV deleted successfully');
    }

    if (file === 'profile-picture') {
      const profilePictureUrl = tutor.profile_picture;
      const parsedUrl = new URL(profilePictureUrl);
      const filePath = parsedUrl.pathname.replace(`/${bucketName}/`, '');

      await storage.bucket(bucketName).file(filePath).delete().catch((err) => {
        console.error(`Failed to delete Profile Picture: ${err.message}`);
      });

      await prisma.tutors.update({
        where: { id: tutorId },
        data: { profile_picture: null },
      });

      return createResponse(h, 200, 'success', 'Profile Picture deleted successfully');
    }

    return createResponse(h, 400, 'fail', 'Incorrect parameter query');
  } catch (err) {
    console.error(err);
  }
};

module.exports = deleteFileTutorsHandler;
