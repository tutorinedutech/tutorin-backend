const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const confirmValidationHandler = async (request, h) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded;
    console.log('Decoded LearnerID:', learnerId);

    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const { classDetailsId } = request.params;
    // const { validationStatus } = request.payload;

    // Query untuk memperbarui validation_status pada Class_details
    const classDetail = await prisma.class_details.findFirst({
      where: {
        id: parseInt(classDetailsId, 10),
        classSession: {
          learner_id: learnerId,
        },
      },
    });

    if (!classDetail) {
      return createResponse(h, 404, 'error', 'Class detail not found or access denied');
    }

    const updatedClassDetail = await prisma.class_details.update({
      where: {
        id: parseInt(classDetailsId, 10),
      },
      data: {
        validation_status: 'Aprroved',
      },
    });

    return createResponse(h, 200, 'success', 'Validation status updated successfully', updatedClassDetail);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while updating validation status', { error: error.message });
  }
};

module.exports = confirmValidationHandler;
