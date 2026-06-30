const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  updateProfilePicture,
  updateResume,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadProfilePicture,
  uploadResume,
} = require("../config/cloudinary");

// Public route — anyone can view a user's profile
router.get("/:id", getUserProfile);

// Private routes — must be logged in
router.put("/profile", protect, updateProfile);

// uploadProfilePicture.single("profilePicture") tells multer to expect
// a single file with the field name "profilePicture"
router.put(
  "/profile-picture",
  protect,
  uploadProfilePicture.single("profilePicture"),
  updateProfilePicture
);

// uploadResume.single("resume") tells multer to expect
// a single file with the field name "resume"
router.put(
  "/resume",
  protect,
  uploadResume.single("resume"),
  updateResume
);

module.exports = router;