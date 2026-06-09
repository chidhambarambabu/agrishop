const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.da0bp9ouy,
  api_key: process.env.697435977769837,
  api_secret: process.env.DRSpk2KfARNLv8K-i2wvDahU2Nc
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'agrishop/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };