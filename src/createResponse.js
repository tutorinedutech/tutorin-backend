const toCamelCase = (obj) => {
  const newObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
      newObj[camelCaseKey] = obj[key];
    }
  }

  return newObj;
};

const createResponse = (h, code, status, message, data = {}) => h.response({
  status,
  message,
  data: toCamelCase(data),
}).code(code);

module.exports = createResponse;
