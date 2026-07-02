const express = require("express");
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  uploadCompanyLogo,
  deleteCompany,
} = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");
const { uploadProfilePicture } = require("../config/cloudinary");

// Public routes
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

// Private routes
router.post("/", protect, createCompany);
router.put("/:id", protect, updateCompany);
router.put(
  "/:id/logo",
  protect,
  uploadProfilePicture.single("logo"),
  uploadCompanyLogo
);
router.delete("/:id", protect, deleteCompany);

module.exports = router;