const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      allowed_formats: async (req, file) => ['png',"jpg", "jpeg"], // supports promises as well
      //public_id: (req, file) => 'computed-filename-using-request',
        //allowedFormat: async (req, file) => ['png',"jpg", "jpeg"],
    },
  });


module.exports = {cloudinary, storage}
