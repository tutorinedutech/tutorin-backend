const createResponse = (h, code, status, message, data = {}) => h.response({
  status,
  message,
  data,
}).code(code);

module.exports = createResponse;
