const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { sendNotificationToUser } = require("../utils/socket");

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (jobseekers only)
const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can apply for jobs",
      });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const { coverLetter, resume } = req.body;

    if (!resume && !req.user.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume before applying",
      });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user.id,
      recruiter: job.postedBy,
      resume: resume || req.user.resume,
      coverLetter: coverLetter || "",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all jobs a jobseeker has applied to
// @route   GET /api/applications/my-applications
// @access  Private (jobseekers only)
const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can access this",
      });
    }

    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location jobType salary")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all applications for a specific job (recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (recruiter who posted the job)
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email profilePicture bio skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update application status (recruiter action)
// @route   PUT /api/applications/:id/status
// @access  Private (recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "reviewing",
      "shortlisted",
      "rejected",
      "hired",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    application.status = status;
    await application.save();

    // Create notification in database
    const notification = await Notification.create({
      recipient: application.applicant,
      sender: req.user.id,
      type: "application_status",
      message: `Your application status has been updated to "${status}"`,
      link: `/applications/my-applications`,
    });

    // Send real-time notification if applicant is online
    const io = req.app.get("io");
    sendNotificationToUser(io, application.applicant.toString(), {
      ...notification.toObject(),
      sender: { _id: req.user.id, name: req.user.name },
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
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
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};