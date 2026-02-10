import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = (file: any) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",

        quality: "auto:good", //quality optimization
        fetch_format: "auto", //format selection
        flags: "progressive", //progressive JPEG loading
        width: 1920,
        height: 1080,
        crop: "limit", /////only resize if larger than specified dimensions
      },
      (error, result) => {
        if (error) {
          logger.error("Error while uploading media to cloudinary", error);
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(file.buffer);
  });
};

const deleteMediaFromCloudinary = async (publicId: any) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Media deleted successfuly from cloud stroage", publicId);
    return result;
  } catch (error) {
    logger.error("Error deleting media from cludinary", error);
    throw error;
  }
};

const getOptimizedImageUrl = (publicId: string, options?: any) => {
  return cloudinary.url(publicId, {
    f_auto: true,
    q_auto: true,
    w_auto: true,
    dpr_auto: true,
    ...options,
  });
};

export {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
  getOptimizedImageUrl,
  cloudinary,
};
