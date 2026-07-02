const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

// All application routes require login
router.post("/:jobId", protect, applyForJob);
router.get("/my-applications", protect, getMyApplications);
router.get("/job/:jobId", protect, getJobApplications);
router.put("/:id/status", protect, updateApplicationStatus);

module.exports = router;