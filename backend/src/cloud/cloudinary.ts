const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "namaskar",
    allowed_formats: ["jpeg", "png", "jpg","webp"], // Corrected key to "allowed_formats"
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// ✅ Correct Export
const upload = multer({ storage });

module.exports = { upload }; // Use module.exports
