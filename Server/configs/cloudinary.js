import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const connectToCloudinary = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary env variables missing");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  console.log("Cloudinary connected");
};

export { cloudinary, connectToCloudinary };


export const uploadToCloudinary = (
  fileBuffer,
  folder,
) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image",
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/* ================= SINGLE DELETE ================= */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};


