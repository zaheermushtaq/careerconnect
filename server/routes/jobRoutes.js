const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Private routes
router.post("/", protect, createJob);
router.get("/recruiter/my-jobs", protect, getMyJobs);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;