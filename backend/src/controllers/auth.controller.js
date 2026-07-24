const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

// ---------- REGISTER ----------
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return errorResponse(res, 400, "Username, email, and password are required");
    }

    // Check if a user with this email or username already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing.rows.length > 0) {
      return errorResponse(res, 409, "Username or email already in use");
    }

    // Hash the password before storing — NEVER store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, username: user.username });

    return successResponse(res, 201, "User registered successfully", {
      user,
      token,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return errorResponse(res, 500, "Something went wrong during registration");
  }
}

// ---------- LOGIN ----------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      // Deliberately vague message — don't reveal whether the email exists
      return errorResponse(res, 401, "Invalid email or password");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken({ id: user.id, username: user.username });

    return successResponse(res, 200, "Login successful", {
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return errorResponse(res, 500, "Something went wrong during login");
  }
}

// ---------- LOGOUT ----------
// With JWT, logout is handled client-side (deleting the token).
// This endpoint exists mainly for consistency with the API spec —
// blacklist:token in Redis (optional) could be added here later.
async function logout(req, res) {
  return successResponse(res, 200, "Logout successful");
}

module.exports = { register, login, logout };