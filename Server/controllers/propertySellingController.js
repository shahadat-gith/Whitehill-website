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


export const submitPropertySelling = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { type } = req.body;
    const seller = req.userId;
    const description = (req.body.description || "").toString().trim();
    const priceAsked = Number(req.body.priceAsked);

    if (!priceAsked || !type) {
      throw new Error("priceAsked and type required");
    }

    if (!description) {
      throw new Error("Description is required");
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

    if (type === "land") {
      const landOwnershipProof = req.files?.landOwnershipProof?.[0] || null;
      const khajnaReceipt = req.files?.khajnaReceipt?.[0] || null;
      const landImageFiles = req.files?.landImages || req.files?.["landImages[]"] || [];

      if (!landOwnershipProof || !khajnaReceipt) {
        throw new Error("Both land ownership proof and khajna receipt are required");
      }

      if (landImageFiles.length < 1) {
        throw new Error("At least 1 land image is required");
      }

      const ownershipDoc = await uploadPdfToCloudinary(
        landOwnershipProof.buffer,
        "property/land/documents"
      );
      uploadedPublicIds.push({ id: ownershipDoc.public_id, type: "raw" });

      const khajnaDoc = await uploadPdfToCloudinary(
        khajnaReceipt.buffer,
        "property/land/documents"
      );
      uploadedPublicIds.push({ id: khajnaDoc.public_id, type: "raw" });

      const images = await Promise.all(
        landImageFiles.map((file) =>
          uploadImageToCloudinary(file.buffer, "property/land/images")
        )
      );
      images.forEach((image) => uploadedPublicIds.push({ id: image.public_id, type: "image" }));

      const property = await PropertySelling.create({
        seller,
        type,
        priceAsked,
        description,
        location,
        isCompleted: true,
        landDetails: {
          ...landDetails,
          documents: {
            ownershipProof: ownershipDoc,
            khajnaReceipt: khajnaDoc,
          },
          images,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Property selling request submitted successfully",
        data: property,
      });
    }

    const ownershipProof = req.files?.ownershipProof?.[0] || null;
    const buildingPlan = req.files?.buildingPlan?.[0] || null;
    const propertyImageFiles = req.files?.propertyImages || req.files?.["propertyImages[]"] || [];

    if (!ownershipProof || !buildingPlan) {
      throw new Error("Both ownership proof and building plan are required");
    }

    if (propertyImageFiles.length < 1) {
      throw new Error("At least 1 property image is required");
    }

    const ownershipDoc = await uploadPdfToCloudinary(
      ownershipProof.buffer,
      "property/property/documents"
    );
    uploadedPublicIds.push({ id: ownershipDoc.public_id, type: "raw" });

    const buildingPlanDoc = await uploadPdfToCloudinary(
      buildingPlan.buffer,
      "property/property/documents"
    );
    uploadedPublicIds.push({ id: buildingPlanDoc.public_id, type: "raw" });

    const images = await Promise.all(
      propertyImageFiles.map((file) =>
        uploadImageToCloudinary(file.buffer, "property/property/images")
      )
    );
    images.forEach((image) => uploadedPublicIds.push({ id: image.public_id, type: "image" }));

    const property = await PropertySelling.create({
      seller,
      type,
      priceAsked,
      description,
      location,
      isCompleted: true,
      propertyDetails: {
        ...propertyDetails,
        documents: {
          ownershipProof: ownershipDoc,
          buildingPlan: buildingPlanDoc,
        },
        images,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Property selling request submitted successfully",
      data: property,
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

