const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc    Post a new job
// @route   POST /api/jobs
// @access  Private (recruiters only)
const createJob = async (req, res) => {
  try {
    // Only recruiters can post jobs
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can post jobs",
      });
    }

    const {
      title,
      description,
      company,
      location,
      jobType,
      salary,
      skills,
      experience,
      openings,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      jobType,
      salary,
      skills: skills || [],
      experience,
      openings,
      postedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all jobs with search and filters
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    // Extract filter values from query params
    // Example: /api/jobs?keyword=react&location=remote&jobType=full-time
    const { keyword, location, jobType, experience, page = 1, limit = 10 } = req.query;

    // Build a filter object dynamically
    const filter = { isActive: true };

    if (keyword) {
      // Search in title, description, and company using text index
      filter.$text = { $search: keyword };
    }

    if (location) {
      // Case-insensitive partial match for location
      filter.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (experience) {
      filter.experience = experience;
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Find jobs, populate recruiter info, sort by newest first
    const jobs = await Job.find(filter)
      .populate("postedBy", "name email profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Count total matching jobs for pagination info
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email profilePicture"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (recruiter who posted it only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure only the recruiter who posted this job can update it
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update jobs you posted",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (recruiter who posted it only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete jobs you posted",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all jobs posted by the logged in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (recruiters only)
const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access this",
      });
    }

    const jobs = await Job.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
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
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};