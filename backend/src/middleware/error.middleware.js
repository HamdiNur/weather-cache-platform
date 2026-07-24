// Centralized error handler — any time a controller calls next(err),
// or throws inside an async route wrapped properly, it ends up here.
// This keeps error response formatting consistent across the whole API.
function errorMiddleware(err, req, res, next) {
  console.error("❌ Error:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorMiddleware;