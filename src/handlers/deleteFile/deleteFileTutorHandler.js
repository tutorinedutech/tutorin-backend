const { PrismaClient } = require('@prisma/client');
const { Storage } = require('@google-cloud/storage');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const deleteFileTutorHandler = async (request, h) => {
  try {
    const { tutorId } = request.params;
    const { file } = request.query;
    const bucketName = process.env.GOOGLE_BUCKET_NAME;

    const tutor = await prisma.tutors.findUnique({
      where: { id: parseInt(tutorId) },
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
        where: { id: parseInt(tutorId) },
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
        where: { id: parseInt(tutorId) },
        data: { profile_picture: null },
      });

      return createResponse(h, 200, 'success', 'Profile Picture deleted successfully');
    }

    return createResponse(h, 400, 'fail', 'Incorrect parameter query');
  } catch (err) {
    console.error(err);
  }
};

module.exports = deleteFileTutorHandler;
