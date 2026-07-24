// Small helpers so every controller returns responses in the exact same
// shape: { success, message, data }. Keeps the frontend's handling simple
// and predictable across all endpoints.

function successResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { successResponse, errorResponse };