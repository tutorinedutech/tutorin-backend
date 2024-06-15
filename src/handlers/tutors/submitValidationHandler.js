// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const submitValidation = async (request, h) => {
//   const learnerId = parseInt(request.params.learnerId, 10);
//   const {
//     tutorId, timestamp, location, proof_image_link,
//   } = request.payload;

//   if (!tutorId || !timestamp) {
//     return h.response({ error: 'Invalid data' }).code(400);
//   }

//   try {
//     // Cari class_session_id berdasarkan learnerId dan tutorId
//     const classSession = await prisma.class_sessions.findFirst({
//       where: {
//         learner_id: learnerId,
//         tutor_id: tutorId,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (!classSession) {
//       return h.response({ error: 'Class session not found' }).code(404);
//     }

//     // Update data di tabel class_details
//     const result = await prisma.class_details.updateMany({
//       where: {
//         class_session_id: classSession.id,
//       },
//       data: {
//         timestamp: new Date(timestamp),
//         location,
//         proof_image_link,
//         validation_status: 'belum konfirmasi',
//       },
//     });

//     return h.response({ status: 'success', data: result }).code(200);
//   } catch (error) {
//     console.error(error);
//     return h.response({ error: error.message }).code(500);
//   }
// };

// module.exports = submitValidation;
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const submitValidation = async (request, h) => {
  const tutorId = parseInt(request.params.tutorId, 10);
  const {
    learnerId, timestamp, location, proof_image_link,
  } = request.payload;

  // Validate input data
  if (!learnerId || !tutorId || !timestamp) {
    return h.response({ error: 'Invalid data' }).code(400);
  }

  try {
    // Find class sessions matching tutorId and learnerId
    const classSessions = await prisma.class_sessions.findMany({
      where: {
        tutor_id: tutorId,
        learner_id: parseInt(learnerId, 10),
      },
      select: {
        id: true,
      },
    });

    if (!classSessions || classSessions.length === 0) {
      return h.response({ error: 'Class sessions not found' }).code(404);
    }

    // Update class_details for each class session found
    await Promise.all(
      classSessions.map(async (session) => {
        // Update class_details where class_session_id matches the pattern
        const updatedDetails = await prisma.class_details.updateMany({
          where: {
            class_session_id: {
              startsWith: `${learnerId}-${tutorId}-`,
              endsWith: session.id,
            },
          },
          data: {
            timestamp: new Date(timestamp),
            location,
            proof_image_link,
            validation_status: 'not validated',
          },
        });

        console.log(`Updated ${updatedDetails.count} class details for session ${session.id}`);
      }),
    );

    // Prepare and return success response
    const responseData = {
      learnerId, tutorId, timestamp, location, proof_image_link,
    };
    return h.response({ status: 'success', data: responseData }).code(200);
  } catch (error) {
    console.error('Error updating class details:', error);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = submitValidation;
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const submitValidation = async (request, h) => {
//   const tutorId = parseInt(request.params.tutorId, 10);
//   const session = parseInt(request.params.session, 10); // Ambil session dari params
//   const { learnerId, timestamp, location, proof_image_link } = request.payload;

//   console.log('Session:', session);
//   // Validate input data
//   if (!learnerId || !tutorId || !session || !timestamp) {
//     return h.response({ error: 'Invalid data' }).code(400);
//   }

//   try {
//     // Find class session matching tutorId and learnerId
//     const classSession = await prisma.class_sessions.findFirst({
//       where: {
//         tutor_id: tutorId,
//         learner_id: parseInt(learnerId, 10),
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (!classSession) {
//       return h.response({ error: 'Class session not found' }).code(404);
//     }

//     console.log('Class Session ID:', classSession.id);
//     console.log(typeof(classSession.id));

//     // Check existing class details
//     const existingDetails = await prisma.class_details.findMany({
//       where: {
//         class_session_id: `${learnerId}-${tutorId}-`,
//         session: session,
//       },
//     });

//     console.log('Existing Class Details:', existingDetails);

//     // Update class_details for the specific session
//     const updatedDetails = await prisma.class_details.updateMany({
//       where: {
//         class_session_id: `${learnerId}-${tutorId}-${classSession.id}`, // Form class_session_id
//         session: session, // Filter berdasarkan session
//       },
//       data: {
//         timestamp: new Date(timestamp),
//         location,
//         proof_image_link,
//         validation_status: 'not validated', // Update validation status as needed
//       },
//     });

//     console.log(`Updated ${updatedDetails.count} class details for session ${session}`);

//     // Prepare and return success response
//     const responseData = { learnerId, tutorId, session, timestamp, location, proof_image_link };
//     return h.response({ status: 'success', data: responseData }).code(200);
//   } catch (error) {
//     console.error('Error updating class details:', error);
//     return h.response({ error: error.message }).code(500);
//   }
// };

// module.exports = submitValidation;
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const submitValidation = async (request, h) => {
//   const { learnerId, location, proof_image_link } = request.payload;

//   // Validate input data
//   if (!learnerId || !location || !proof_image_link) {
//     return h.response({ error: 'Invalid data' }).code(400);
//   }

//   try {
//     // Find class sessions matching learnerId
//     const classSessions = await prisma.class_sessions.findMany({
//       where: {
//         learner_id: learnerId,
//       },
//     });

//     if (!classSessions || classSessions.length === 0) {
//       return h.response({ error: 'No class sessions found for learner' }).code(404);
//     }

//     // Update class_details for each class session found
//     await Promise.all(
//       classSessions.map(async (session) => {
//         // Update class_details where class_session_id matches the pattern
//         const updatedDetails = await prisma.class_details.updateMany({
//           where: {
//             class_session_id: {
//               startsWith: `${learnerId}-${session.tutor_id}-`,
//             },
//           },
//           data: {
//             timestamp: new Date(),
//             location,
//             proof_image_link,
//             validation_status: 'not validated',
//           },
//         });

//         console.log(`Updated ${updatedDetails.count} class details for session ${session.id}`);
//       }),
//     );

//     // Prepare and return success response
//     const responseData = { learnerId, location, proof_image_link };
//     return h.response({ status: 'success', data: responseData }).code(200);
//   } catch (error) {
//     console.error('Error updating class details:', error);
//     return h.response({ error: error.message }).code(500);
//   }
// };

// module.exports = submitValidation;
