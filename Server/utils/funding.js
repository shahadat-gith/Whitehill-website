import {
  uploadImageToCloudinary,
  uploadPdfToCloudinary,
  uploadVideoToCloudinary
} from "../configs/cloudinary.js";


export const parseIfJSON = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const getUploadHandler = (mimetype) => {
  if (mimetype.startsWith("image/")) {
    return { fn: uploadImageToCloudinary, resource_type: "image" };
  }
  if (mimetype.startsWith("video/")) {
    return { fn: uploadVideoToCloudinary, resource_type: "video" };
  }
  return { fn: uploadPdfToCloudinary, resource_type: "raw" };
};

export const cleanEmpty = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      cleanEmpty(obj[key]);
      if (Object.keys(obj[key]).length === 0) delete obj[key];
    }
    if (obj[key] === undefined || obj[key] === null) delete obj[key];
  });
};

export const deepMerge = (target, source) => {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
};