const Company = require("../models/Company");
const Job = require("../models/Job");
const User = require("../models/User");
const { uploadProfilePicture } = require("../config/cloudinary");

// @desc    Create a company profile
// @route   POST /api/companies
// @access  Private (recruiters only)
const createCompany = async (req, res) => {
  try {
    // Only recruiters can create companies
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create company profiles",
      });
    }

    const {
      name,
      description,
      website,
      location,
      industry,
      size,
      foundedYear,
    } = req.body;

    // Check if company name already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "A company with this name already exists",
      });
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      industry,
      size,
      foundedYear,
      createdBy: req.user.id,
    });

    // Link this company to the recruiter's profile
    await User.findByIdAndUpdate(req.user.id, {
      company: company._id,
    });

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getAllCompanies = async (req, res) => {
  try {
    const { industry, location, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (industry) {
      filter.industry = { $regex: industry, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const companies = await Company.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get a single company by ID with its job listings
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "createdBy",
      "name email profilePicture"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Get all active jobs posted by this company
    const jobs = await Job.find({
      company: company.name,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      company,
      jobs,
      totalJobs: jobs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (recruiter who created it)
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Only the recruiter who created this company can update it
    if (company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own company profile",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Upload company logo
// @route   PUT /api/companies/:id/logo
// @access  Private (recruiter who created it)
const uploadCompanyLogo = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { logo: req.file.path },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Company logo uploaded successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete company profile
// @route   DELETE /api/companies/:id
// @access  Private (recruiter who created it)
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own company profile",
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    // Remove company reference from recruiter's profile
    await User.findByIdAndUpdate(req.user.id, {
      company: null,
    });

    res.status(200).json({
      success: true,
      message: "Company profile deleted successfully",
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
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  uploadCompanyLogo,
  deleteCompany,
};