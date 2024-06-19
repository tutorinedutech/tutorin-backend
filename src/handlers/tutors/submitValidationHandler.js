const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const { uploadValidation } = require('../../uploadFileToGCS');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

// Fungsi untuk mengunggah berkas dengan penanganan kesalahan
const handleFileUpload = async (file, uploadFunction) => {
  try {
    return await uploadFunction(file);
  } catch (error) {
    if (error.code === 400) {
      return { status: 'fail', message: error.message };
    }
    throw error;
  }
};

const submitValidationHandler = async (request, h) => {
  try {
    // Dapatkan token dari header Authorization
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { tutorId } = decoded; // Mengambil tutorId dari token
    console.log('Decoded TutorID:', tutorId);

    if (!tutorId) {
      return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
    }

    const { classDetailsId } = request.params;
    const { timestamp, location, proofImage } = request.payload;

    // Periksa apakah class detail dengan id yang diberikan ada dan milik tutor yang tepat
    const classDetail = await prisma.class_details.findFirst({
      where: {
        id: parseInt(classDetailsId, 10),
        classSession: {
          tutor_id: tutorId,
        },
      },
    });

    if (!classDetail) {
      return createResponse(h, 404, 'error', 'Class detail not found or access denied');
    }

    // Tambahkan pemeriksaan apakah class detail sudah diapprove
    if (classDetail.validation_status === 'Aprroved') {
      return createResponse(h, 400, 'error', 'Class detail has already been approved and cannot be updated');
    }

    // Pengecekan apakah class session sebelumnya sudah diapprove
    if (classDetail.session > 1) {
      const previousClassDetail = await prisma.class_details.findFirst({
        where: {
          class_session_id: classDetail.class_session_id,
          session: classDetail.session - 1,
        },
      });

      if (!previousClassDetail || previousClassDetail.validation_status !== 'Aprroved') {
        return createResponse(h, 400, 'error', 'Previous class session must be approved');
      }
    }

    // Generate new timestamp in GMT+7 and add 7 hours to it
    // const timestamp = moment().tz('Asia/Jakarta').add(7, 'hours').toDate();
    const proofImageUrl = proofImage ? await handleFileUpload(proofImage, uploadValidation) : null;

    if (proofImageUrl && proofImageUrl.status === 'fail') {
      return createResponse(h, 400, 'fail', proofImageUrl.message);
    }

    // Update class detail dengan data yang diberikan
    const updatedClassDetail = await prisma.class_details.update({
      where: {
        id: parseInt(classDetailsId, 10),
      },
      // timstamp input siswa
      data: {
        timestamp,
        location,
        proof_image_link: proofImageUrl,
        validation_status: 'not validated',
      },
    });

    return createResponse(h, 200, 'success', 'Class detail updated successfully', updatedClassDetail);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while updating class details', { error: error.message });
  }
};

module.exports = submitValidationHandler;
