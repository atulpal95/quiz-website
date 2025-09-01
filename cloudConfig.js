const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { param } = require('./Routes/listing');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECERET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust',
        allowedformat:["png","jpg","jpeg"],
    },
  });
module.exports={
    cloudinary,
    storage
}