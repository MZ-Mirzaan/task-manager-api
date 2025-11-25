const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { registerSchema, loginSchema } = require("../validation/authValidation");

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Check if email exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into DB
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    const user = result.rows[0];
    res.status(201).json({ id: user.id, email: user.email });

  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Check if user exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ token });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
