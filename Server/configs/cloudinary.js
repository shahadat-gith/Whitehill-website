import {v2 as cloudinary} from 'cloudinary';
import streamifier from "streamifier";

const CLOUDINARY_CLOUD_NAME="dncdmquei"
const CLOUDINARY_API_KEY="352342519189355"
const CLOUDINARY_API_SECRET="_RwDmcSCoV3cl8Z4H9nU3OH9_nQ"

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
});



/* ================= SINGLE UPLOAD ================= */
/**
 * Upload buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @param {Object} options
 * @param {boolean} options.isPdf - true if file is PDF
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = (
  fileBuffer,
  folder,
  { isPdf = false } = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image", // ✅ ALWAYS image for preview
    };

    // ✅ Important for PDFs
    if (isPdf) {
      uploadOptions.format = "pdf";
    }

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

/* ================= MULTIPLE UPLOAD ================= */
export const uploadMultipleToCloudinary = async (
  fileBuffers,
  folder,
  { isPdf = false } = {}
) => {
  return Promise.all(
    fileBuffers.map((buffer) =>
      uploadToCloudinary(buffer, folder, { isPdf })
    )
  );
};

/* ================= MULTIPLE DELETE ================= */
export const deleteMultipleFromCloudinary = async (
  publicIds,
  resourceType = "image"
) => {
  return Promise.all(
    publicIds.map((id) => deleteFromCloudinary(id, resourceType))
  );
};
