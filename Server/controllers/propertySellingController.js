import PropertySelling from "../models/propertySelling.js";
import {
  uploadPdfToCloudinary,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
  deleteFromCloudinary,
} from "../configs/cloudinary.js";

const parseJSON = (field) => {
  if (!field) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      throw new Error("Invalid JSON payload");
    }
  }
  return field;
};

const getListingByOwner = async (propertyId, userId) => {
  const listing = await PropertySelling.findById(propertyId);

  if (!listing) {
    throw new Error("Property selling request not found");
  }

  if (listing.seller.toString() !== userId) {
    throw new Error("You are not authorized to update this listing");
  }

  return listing;
};

export const createPropertySellingDetails = async (req, res) => {
  try {
    const { type } = req.body;
    const seller = req.userId;

    const priceAsked = Number(req.body.priceAsked);
    const costPrice = Number(req.body.costPrice || 0);
    const sellingPrice = Number(req.body.sellingPrice || 0);

    if (!priceAsked || !type) {
      throw new Error("priceAsked and type required");
    }

    if (!["land", "property"].includes(type)) {
      throw new Error("Invalid type");
    }

    const location = parseJSON(req.body.location);
    const landDetails = parseJSON(req.body.landDetails);
    const propertyDetails = parseJSON(req.body.propertyDetails);

    if (!location) {
      throw new Error("Location details are required");
    }

    if (type === "land" && !landDetails) {
      throw new Error("Land details required");
    }

    if (type === "property" && !propertyDetails) {
      throw new Error("Property details required");
    }

    const payload = {
      seller,
      type,
      priceAsked,
      costPrice,
      sellingPrice,
      location,
      landDetails:
        type === "land"
          ? {
              ...landDetails,
              documents: {
                ownershipProof: null,
                khajnaReceipt: null,
              },
              images: [],
            }
          : undefined,
      propertyDetails:
        type === "property"
          ? {
              ...propertyDetails,
              documents: {
                ownershipProof: null,
                buildingPlan: null,
              },
              video: {
                outsideView: null,
                insideView: null,
              },
              images: [],
            }
          : undefined,
    };

    const property = await PropertySelling.create(payload);

    return res.status(201).json({
      success: true,
      message: "Property details saved. You can now upload files in steps.",
      data: property,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadPropertySellingDocuments = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { id } = req.params;
    const listing = await getListingByOwner(id, req.userId);

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error("No documents provided");
    }

    if (listing.type === "land") {
      if (req.files?.landOwnershipProof?.[0]) {
        const result = await uploadPdfToCloudinary(
          req.files.landOwnershipProof[0].buffer,
          "property/land/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        listing.landDetails.documents.ownershipProof = result;
      }

      if (req.files?.khajnaReceipt?.[0]) {
        const result = await uploadPdfToCloudinary(
          req.files.khajnaReceipt[0].buffer,
          "property/land/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        listing.landDetails.documents.khajnaReceipt = result;
      }
    } else {
      if (req.files?.ownershipProof?.[0]) {
        const result = await uploadPdfToCloudinary(
          req.files.ownershipProof[0].buffer,
          "property/property/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        listing.propertyDetails.documents.ownershipProof = result;
      }

      if (req.files?.buildingPlan?.[0]) {
        const result = await uploadPdfToCloudinary(
          req.files.buildingPlan[0].buffer,
          "property/property/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        listing.propertyDetails.documents.buildingPlan = result;
      }
    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      data: listing,
    });
  } catch (error) {
    for (const file of uploadedPublicIds) {
      await deleteFromCloudinary(file.id, file.type);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadPropertySellingImages = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { id } = req.params;
    const listing = await getListingByOwner(id, req.userId);

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error("No images provided");
    }

    if (listing.type === "land") {
      if (!req.files?.landImages?.length) {
        throw new Error("Land images are required");
      }

      const images = await Promise.all(
        req.files.landImages.map((file) =>
          uploadImageToCloudinary(file.buffer, "property/land/images")
        )
      );

      images.forEach((image) => {
        uploadedPublicIds.push({ id: image.public_id, type: "image" });
      });

      listing.landDetails.images = images;
    } else {
      if (!req.files?.propertyImages?.length) {
        throw new Error("Property images are required");
      }

      const images = await Promise.all(
        req.files.propertyImages.map((file) =>
          uploadImageToCloudinary(file.buffer, "property/property/images")
        )
      );

      images.forEach((image) => {
        uploadedPublicIds.push({ id: image.public_id, type: "image" });
      });

      listing.propertyDetails.images = images;
    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: listing,
    });
  } catch (error) {
    for (const file of uploadedPublicIds) {
      await deleteFromCloudinary(file.id, file.type);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadPropertySellingVideos = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { id } = req.params;
    const listing = await getListingByOwner(id, req.userId);

    if (listing.type !== "property") {
      throw new Error("Videos are only supported for property listings");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error("No videos provided");
    }

    if (req.files?.outsideView?.[0]) {
      const result = await uploadVideoToCloudinary(
        req.files.outsideView[0].buffer,
        "property/property/videos"
      );

      uploadedPublicIds.push({ id: result.public_id, type: "video" });
      listing.propertyDetails.video.outsideView = result;
    }

    if (req.files?.insideView?.[0]) {
      const result = await uploadVideoToCloudinary(
        req.files.insideView[0].buffer,
        "property/property/videos"
      );

      uploadedPublicIds.push({ id: result.public_id, type: "video" });
      listing.propertyDetails.video.insideView = result;
    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Videos uploaded successfully",
      data: listing,
    });
  } catch (error) {
    for (const file of uploadedPublicIds) {
      await deleteFromCloudinary(file.id, file.type);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
