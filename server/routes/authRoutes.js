const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
// Public routes (no token needed)
router.post("/register", register);
router.post("/login", login);

// Private route (token required)
router.get("/me", protect, getMe);

module.exports = router;