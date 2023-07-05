const sendResponse = (response, payload, code) => {
  let status = 'error';
  const statusCode = code.toString();
  if (statusCode.startsWith('2')) {
    status = 'success';
  } else if (statusCode.startsWith('4')) {
    status = 'failed';
  }
  response.status(code).json({
    status,
    data: {
      ...payload,
    },
  });
};

module.exports = sendResponse;
