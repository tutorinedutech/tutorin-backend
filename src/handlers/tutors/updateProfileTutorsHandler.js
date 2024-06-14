const { PrismaClient } = require('@prisma/client');
const { Storage } = require('@google-cloud/storage');
const Bcrypt = require('bcrypt');
const {
  uploadKtp,
  uploadProfilePicture,
  uploadCv,
} = require('../../uploadFileToGCS');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GOOGLE_BUCKET_NAME;

const updateProfileTutorsHandler = async (request, h) => {
  const contentType = request.headers['content-type'];
  const { tutorId } = request.params;

  try {
    if (contentType.includes('multipart/form-data')) {
      const {
        ktp,
        profilePicture,
        cv,
      } = request.payload;

      const tutor = await prisma.tutors.findFirst({
        where: { id: parseInt(tutorId) },
      });

      if (ktp) {
        const currentKtpUrl = tutor.ktp;
        const parsedUrl = new URL(currentKtpUrl);
        const filePath = parsedUrl.pathname.replace(`/${bucketName}/`, '');

        await storage.bucket(bucketName).file(filePath).delete().catch((err) => {
          console.error(`Failed to delete ktp: ${err.message}`);
          return createResponse(500, 'fail', 'Failed to delete ktp');
        });

        const newKtpUrl = await uploadKtp(ktp);

        await prisma.tutors.update({
          where: { id: tutor.id },
          data: {
            ktp: newKtpUrl,
          },
        });
      }

      if (profilePicture) {
        const currentProfilePictureUrl = tutor.profile_picture;

        if (currentProfilePictureUrl) {
          const parsedUrl = new URL(currentProfilePictureUrl);
          const filePath = parsedUrl.pathname.replace(`/${bucketName}/`, '');

          await storage.bucket(bucketName).file(filePath).delete().catch((err) => {
            console.error(`Failed to delete profile picture: ${err.message}`);
            return createResponse(500, 'fail', 'Failed to delete profile picture');
          });
        }

        const newprofilePictureUrl = await uploadProfilePicture(profilePicture);

        await prisma.tutors.update({
          where: { id: tutor.id },
          data: {
            profile_picture: newprofilePictureUrl,
          },
        });
      }

      if (cv) {
        const currentCvUrl = tutor.cv;

        if (currentCvUrl) {
          const parsedUrl = new URL(currentCvUrl);
          const filePath = parsedUrl.pathname.replace(`/${bucketName}/`, '');

          await storage.bucket(bucketName).file(filePath).delete().catch((err) => {
            console.error(`Failed to delete CV: ${err.message}`);
            return createResponse(500, 'fail', 'Failed to delete CV');
          });
        }

        const newCvUrl = await uploadCv(cv);

        await prisma.tutors.update({
          where: { id: tutor.id },
          data: {
            cv: newCvUrl,
          },
        });
      }

      const updatedTutor = await prisma.tutors.findFirst({
        where: { id: parseInt(tutorId) },
        select: {
          ktp: true,
          profile_picture: true,
          cv: true,
        },
      });

      return createResponse(h, 200, 'success', 'Tutor profile file successfully updated', updatedTutor);
    }
    const {
      email,
      username,
      password,
      name,
      educationLevel,
      phoneNumber,
      domicile,
      languages,
      teachingApproach,
      accountNumber,
      availability,
      learningMethod,
    } = request.payload;

    // Ambil data tutor dari database untuk mendapatkan nilai saat ini
    const tutor = await prisma.tutors.findFirst({
      where: { id: parseInt(tutorId) },
      include: {
        user: true,
      },
    });

    // ubah pengembalian respon dengan menggunakan modul createRespon
    if (!tutor.user) {
      return createResponse(h, 404, 'fail', 'Tutor not found');
    }

    // Gunakan nilai yang ada jika email atau username tidak diberikan
    const newEmail = email || tutor.user.email;
    const newUsername = username || tutor.user.username;

    // Periksa apakah email atau username sudah ada di database selain dari user yang sedang diupdate
    const emailExists = await prisma.users.findFirst({
      where: {
        email: newEmail,
        id: { not: parseInt(tutor.user_id) },
      },
    });

    if (emailExists) {
      return createResponse(h, 400, 'fail', 'Email already exists');
    }

    const usernameExists = await prisma.users.findFirst({
      where: {
        username: newUsername,
        id: { not: parseInt(tutor.user_id) },
      },
    });

    if (usernameExists) {
      return createResponse(h, 400, 'fail', 'Username already exists');
    }

    // Periksa apakah password ada, jika ada, hash password baru
    let hashedPassword = null;
    if (password) {
      hashedPassword = await Bcrypt.hash(password, 10);
    }

    // Perbarui data dalam tabel users
    await prisma.users.update({
      where: { id: parseInt(tutor.user_id) },
      data: {
        email,
        username,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    if (availability) {
      try {
        // Validasi bahwa availability adalah array dan tidak kosong
        if (!Array.isArray(availability) || availability.length === 0) {
          return createResponse(h, 400, 'fail', 'Invalid availability data');
        }

        await prisma.availabilities.deleteMany({
          where: {
            tutor_id: tutor.id,
          },
        });

        const newAvailabilities = availability.map((avail) => ({
          tutor_id: tutor.id,
          subject: avail.subject,
          day: avail.day,
          time: avail.time,
        }));

        await prisma.availabilities.createMany({
          data: newAvailabilities,
        });

        await prisma.availabilities.findMany({
          where: {
            tutor_id: tutor.id,
          },
          select: {
            subject: true,
            day: true,
            time: true,
          },
        });
      } catch (error) {
        console.error(error);
        return createResponse(h, 400, 'fail', 'Availability data format is incorrect');
      }
    }

    // Jika baris dalam tabel tutors ditemukan, perbarui
    await prisma.tutors.update({
      where: { id: tutor.id },
      data: {
        name,
        education_level: educationLevel,
        phone_number: phoneNumber,
        domicile,
        languages,
        teaching_approach: teachingApproach,
        account_number: accountNumber,
        learning_method: learningMethod,
      },
    });

    const newTutor = await prisma.tutors.findUnique({
      where: { id: tutor.id },
      include: {
        user: true,
        availabilities: true,
      },
    });
    return createResponse(h, 200, 'success', 'Tutor profile successfully updated', newTutor);
  } catch (error) {
    console.error('Error updating user and tutor data:', error);
    return createResponse(h, 500, 'error', 'Tutor profile cannot be updated, internal Server Error');
  }
};

module.exports = updateProfileTutorsHandler;
