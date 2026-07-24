const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");

// Protects routes that require a logged-in user.
// Expects header: Authorization: Bearer <token>
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "No token provided, access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    // Attach the decoded user info (id, username) to req.user
    // so any controller down the chain can access it via req.user.id
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 401, "Invalid or expired token");
  }
}

module.exports = authMiddleware;