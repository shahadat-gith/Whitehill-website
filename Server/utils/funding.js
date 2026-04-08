import { uploadPdfToCloudinary } from "../configs/cloudinary.js";

export const parseJSON = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid JSON format for ${fieldName || "field"}`);
  }
};

export const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  const trimmed = String(value).trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return parseJSON(trimmed, "array field");
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
};

export const uploadFile = async (file, folder) => {
  if (!file) return null;
  const result = await uploadPdfToCloudinary(file.buffer, folder);
  return {
    url: result.url,
    public_id: result.public_id,
  };
};

export const uploadFiles = async (files = [], folder) => {
  const uploaded = [];
  for (const file of files) {
    const result = await uploadPdfToCloudinary(file.buffer, `${folder}/${file.originalname.replace(/\s+/g, "_")}`);
    uploaded.push({ url: result.url, public_id: result.public_id });
  }
  return uploaded;
};

export const buildConsent = (value) => {
  const payload = parseJSON(value, "consent") || {};

  return {
    agreedToTerms: Boolean(payload.agreedToTerms),
    agreedToPrivacyPolicy: Boolean(payload.agreedToPrivacyPolicy),
    agreedToCreditCheck: Boolean(payload.agreedToCreditCheck),
    consentedAt: payload.consentedAt ? new Date(payload.consentedAt) : new Date(),
  };
};
