import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const hasCloudinaryConfig = Boolean(cloudName && apiKey && apiSecret);
export const isCloudinaryConfigured = hasCloudinaryConfig;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

// Simplified helper function to upload image to Cloudinary
export const uploadToCloudinary = async (file) => {
  try {
    if (!hasCloudinaryConfig) {
      throw new Error(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env"
      );
    }

    if (!file?.path) {
      throw new Error("No file path found for upload");
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profile-pictures",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
      ],
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

export default cloudinary;
