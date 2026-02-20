import PropertySelling from "../models/propertySelling.js";
import {
  uploadPdfToCloudinary,
  uploadImageToCloudinary,
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



export const getPropertyRequestCompletionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyRequest = await PropertySelling.findById(id);

    if (!propertyRequest) {
      throw new Error("Property selling request not found");
    }


    return res.status(200).json({
      success: true,
      isCompleted: propertyRequest.isCompleted,
      type: propertyRequest.type,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const createPropertySellingDetails = async (req, res) => {
  try {
    const { type } = req.body;
    const seller = req.userId;
    const description = (req.body.description || "").toString().trim();

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
      description,
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

export const uploadPropertySellingFiles = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { id } = req.params;
    const propertyRequest = await PropertySelling.findById(id);

    if (!propertyRequest) {
      throw new Error("Property selling request not found");
    }

    if (propertyRequest.seller.toString() !== req.userId) {
      throw new Error("You are not authorized to update this property selling request");
    }

    if (propertyRequest.type === "land") {
      const landOwnershipProof = req.files?.landOwnershipProof?.[0] || null;
      const khajnaReceipt = req.files?.khajnaReceipt?.[0] || null;
      const landImageFiles = req.files?.landImages || req.files?.["landImages[]"] || [];

      if (!landOwnershipProof || !khajnaReceipt) {
        throw new Error("Both land ownership proof and khajna receipt are required");
      }

      if (landImageFiles.length < 5) {
        throw new Error("Minimum 5 land images are required");
      }

      if (landOwnershipProof) {
        const result = await uploadPdfToCloudinary(
          landOwnershipProof.buffer,
          "property/land/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        propertyRequest.landDetails.documents.ownershipProof = result;
      }

      if (khajnaReceipt) {
        const result = await uploadPdfToCloudinary(
          khajnaReceipt.buffer,
          "property/land/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        propertyRequest.landDetails.documents.khajnaReceipt = result;
      }

      const images = await Promise.all(
        landImageFiles.map((file) =>
          uploadImageToCloudinary(file.buffer, "property/land/images")
        )
      );

      images.forEach((image) => {
        uploadedPublicIds.push({ id: image.public_id, type: "image" });
      });

      propertyRequest.landDetails.images = images;
    } else {
      const ownershipProof = req.files?.ownershipProof?.[0] || null;
      const buildingPlan = req.files?.buildingPlan?.[0] || null;
      const propertyImageFiles = req.files?.propertyImages || req.files?.["propertyImages[]"] || [];

      if (!ownershipProof || !buildingPlan) {
        throw new Error("Both ownership proof and building plan are required");
      }

      if (propertyImageFiles.length < 5) {
        throw new Error("Minimum 5 property images are required");
      }

      if (ownershipProof) {
        const result = await uploadPdfToCloudinary(
          ownershipProof.buffer,
          "property/property/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        propertyRequest.propertyDetails.documents.ownershipProof = result;
      }

      if (buildingPlan) {
        const result = await uploadPdfToCloudinary(
          buildingPlan.buffer,
          "property/property/documents"
        );

        uploadedPublicIds.push({ id: result.public_id, type: "raw" });
        propertyRequest.propertyDetails.documents.buildingPlan = result;
      }

      const images = await Promise.all(
        propertyImageFiles.map((file) =>
          uploadImageToCloudinary(file.buffer, "property/property/images")
        )
      );

      images.forEach((image) => {
        uploadedPublicIds.push({ id: image.public_id, type: "image" });
      });

      propertyRequest.propertyDetails.images = images;
    }

    propertyRequest.isCompleted = true;

    await propertyRequest.save();

    return res.status(200).json({
      success: true,
      message: "Documents and images uploaded successfully",
      data: propertyRequest,
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

