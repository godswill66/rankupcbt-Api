const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Link to your Cloudinary account using variables from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// 2. Setup where and how the images are stored
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rankup_profiles', // This is the folder name that will appear in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }] // Automatically makes it a square
  },
});

const upload = multer({ storage: storage });

module.exports = upload;