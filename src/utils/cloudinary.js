const { v2: cloudinary } = require("cloudinary");

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadImage = async (file, folder) => {
  if (!file) {
    const error = new Error("Nessun file caricato");
    error.status = 400;
    throw error;
  }

  const base64Image = file.buffer.toString("base64");
  const fileString = `data:${file.mimetype};base64,${base64Image}`;

  return cloudinary.uploader.upload(fileString, {
    folder,
  });
};

module.exports = uploadImage;

