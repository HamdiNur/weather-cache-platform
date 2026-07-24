const jwt = require("jsonwebtoken");
require("dotenv").config();

// Creates a signed JWT containing the user's id and username.
// This token is what the frontend will store and send back on every
// authenticated request (in the Authorization header).
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Verifies a token's signature and expiration.
// Throws an error automatically if invalid/expired — caller must catch it.
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };