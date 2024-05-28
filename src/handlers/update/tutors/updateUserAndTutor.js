const { PrismaClient } = require('@prisma/client');
const Bcrypt = require('bcrypt');
const {
  uploadKtpToGCS,
  uploadProfilePictureToGCS,
  uploadCVToGCS,
} = require('../../signUp/uploadFileToGCS');

const prisma = new PrismaClient();

const updateUserAndTutor = async (request, h) => {
  const { id } = request.params;
  const {
    email,
    username,
    password,
    educationLevel,
    phoneNumber,
    domicile,
    languages,
    subjects,
    teachingCriteria,
    rekeningNumber,
    availability,
    studiedMethod,
    ktp,
    profilePicture,
    cv,
  } = request.payload;
  try {
    // Periksa apakah email atau username sudah ada di database selain dari user yang sedang diupdate
    const emailExists = await prisma.users.findFirst({
      where: {
        email,
        id: { not: parseInt(id) },
      },
    });

    if (emailExists) {
      return h.response({
        status: 'fail',
        message: 'Email already exists',
      }).code(400);
    }

    const usernameExists = await prisma.users.findFirst({
      where: {
        username,
        id: { not: parseInt(id) },
      },
    });

    if (usernameExists) {
      return h.response({
        status: 'fail',
        message: 'Username already exists',
      }).code(400);
    }

    // Periksa apakah password ada, jika ada, hash password baru
    let hashedPassword = null;
    if (password) {
      hashedPassword = await Bcrypt.hash(password, 10);
    }

    // Upload file ke Google Cloud Storage dan dapatkan URLnya
    // const ktpUrl = ktp ? await uploadFile(ktp, 'arsip-ktp', 'ktp') : null;
    // const profilePictureUrl = profilePicture ? await uploadFile(profilePicture, 'arsip-profile-picture', 'profile-picture') : null;
    // const cvUrl = cv ? await uploadFile(cv, 'arsip-cv', 'cv') : null;

    // Upload Profile Picture to GCS
    // let profilePicUrl = 'https://storage.googleapis.com/simpan-data-gambar-user/arsip-profile-picture/profile-picture_default.png'; // default profile picture
    // if (profilePicture && profilePicture.hapi && profilePicture.hapi.filename) {
    //   try {
    //     profilePicUrl = await uploadProfilePictureToGCS(profilePicture);
    //   } catch (error) {
    //     if (error.message === 'Invalid file type. Only PNG, JPG, and GIF files are allowed.') {
    //       return h.response({
    //         status: 'fail',
    //         message: error.message,
    //       }).code(error.code || 400);
    //     }
    //     throw error;
    //   }
    // }

    // // Upload KTP to GCS
    // let ktpUrl = 'You have not upload KTP file already';
    // if (ktp && ktp.hapi && ktp.hapi.filename) {
    //   try {
    //     ktpUrl = await uploadKtpToGCS(ktp);
    //   } catch (error) {
    //     if (error.message === 'Invalid file type. Only PNG, JPG, and GIF files are allowed.') {
    //       return h.response({
    //         status: 'fail',
    //         message: error.message,
    //       }).code(error.code || 400);
    //     }
    //     throw error;
    //   }
    // }

    // Upload CV to GCS
    let cvUrl = 'You have not uploaded a CV file yet';
    if (cv && cv.hapi && cv.hapi.filename) {
      try {
        cvUrl = await uploadCVToGCS(cv);
      } catch (error) {
        if (error.message === 'Invalid file type. Only PDF files are allowed.') {
          return h.response({
            status: 'fail',
            message: error.message,
          }).code(error.code || 400);
        }
        throw error;
      }
    }

    // Perbarui data dalam tabel users
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        email,
        username,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // Cari baris dalam tabel tutors berdasarkan user_id menggunakan findFirst
    const tutor = await prisma.tutors.findFirst({
      where: { user_id: parseInt(id) },
    });

    // Jika baris dalam tabel tutors ditemukan, perbarui
    let updatedTutor = null;
    if (tutor) {
      updatedTutor = await prisma.tutors.update({
        where: { id: tutor.id }, // Gunakan id unik dari tabel tutors
        data: {
          education_level: educationLevel,
          phone_number: phoneNumber,
          domicile,
          languages,
          subjects,
          teaching_criteria: teachingCriteria,
          rekening_number: rekeningNumber,
          availability,
          studied_method: studiedMethod,
          //   ktp: ktpUrl,
          //   profile_picture: profilePicUrl,
          //   cv: cvUrl,
          // ...(ktpUrl && { ktp: ktpUrl }),
          //   ...(profilePictureUrl && { profile_picture: profilePictureUrl }),
          //   ...(cvUrl && { cv: cvUrl }),

        },
      });
    }

    // Tanggapi dengan data yang diperbarui
    return h.response({
      status: 'Success',
      message: 'User and tutor data updated successfully',
      data: { updatedUser, updatedTutor },
    }).code(200);
  } catch (error) {
    // Tangani kesalahan
    console.error('Error updating user and tutor data:', error);
    return h.response({
      status: 'error',
      message: 'Internal Server Error',
      data: {},
    }).code(500);
  }
};

module.exports = updateUserAndTutor;
