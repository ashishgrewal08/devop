const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'greywall_DEV',
    allowedFormats:  ["png","jpg","jpeg"],
   public_id: (req, file) => {
    return `img-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    },
  },
});

module.exports={
    cloudinary,
    storage,
}