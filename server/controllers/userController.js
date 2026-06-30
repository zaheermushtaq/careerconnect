const User = require("../models/User");

// @desc    Get any user's public profile by their ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update logged in user's profile (name, bio, skills)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    // Build an object with only the fields that were actually sent
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;

    // Skills comes as a comma-separated string: "JavaScript,React,Node.js"
    // We split it into an array: ["JavaScript", "React", "Node.js"]
    if (skills) {
      updateFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Find the logged in user and update their profile
    const user = await User.findByIdAndUpdate(
      req.user.id,        // who to update (from JWT token via protect middleware)
      updateFields,       // what to update
      { new: true }       // return the updated document, not the old one
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Upload or update profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
const updateProfilePicture = async (req, res) => {
  try {
    // req.file is added by multer after it uploads to Cloudinary
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    // req.file.path contains the Cloudinary URL of the uploaded image
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Upload or update resume
// @route   PUT /api/users/resume
// @access  Private
const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: req.file.path },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  updateProfilePicture,
  updateResume,
};