const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Connect to your Cloudinary account using credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "careerconnect/profile-pictures", // folder name in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],  // only allow image files
    transformation: [{ width: 500, height: 500, crop: "fill" }], // auto resize to 500x500
  },
});

// Storage configuration for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "careerconnect/resumes", // separate folder for resumes
    allowed_formats: ["pdf"],         // only allow PDF files
    resource_type: "raw",             // "raw" means non-image file
  },
});

// Create multer upload handlers using the storage configs above
const uploadProfilePicture = multer({ storage: profilePictureStorage });
const uploadResume = multer({ storage: resumeStorage });

module.exports = { uploadProfilePicture, uploadResume };