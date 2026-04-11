import { Funding } from "../models/funding/index.js";
import { deleteFromCloudinary } from "../configs/cloudinary.js";
import { parseIfJSON, getUploadHandler, cleanEmpty, deepMerge, formatErrorResponse } from "../utils/funding.js";




export const createFunding = async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.user = req.userId;

    // Parse JSON fields
    payload.fundDetails = parseIfJSON(payload.fundDetails);
    payload.disclosures = parseIfJSON(payload.disclosures);
    payload.consent = parseIfJSON(payload.consent);
    payload.startup = parseIfJSON(payload.startup);
    payload.business = parseIfJSON(payload.business);
    payload.property = parseIfJSON(payload.property);
    payload.riskFactors = parseIfJSON(payload.riskFactors);
    payload.documents = payload.documents
      ? parseIfJSON(payload.documents)
      : {};

    // Upload files
    if (req.files) {
      const uploadedDocs = {};

      for (const fieldName of Object.keys(req.files)) {
        const filesArr = req.files[fieldName];

        const isArrayField =
          fieldName === "additionalDocs" ||
          fieldName === "noObjectionCertificates";

        if (isArrayField) {
          uploadedDocs[fieldName] = [];

          for (const file of filesArr) {
            const { fn, resource_type } = getUploadHandler(file.mimetype);

            const result = await fn(
              file.buffer,
              `funding/${payload.type}/documents/${fieldName}`
            );

            uploadedDocs[fieldName].push({
              url: result.url,
              public_id: result.public_id,
              resource_type,
              originalName: file.originalname,
            });
          }
        } else {
          const file = filesArr[0];
          const { fn, resource_type } = getUploadHandler(file.mimetype);

          const result = await fn(
            file.buffer,
            `funding/${payload.type}/documents/${fieldName}`
          );

          uploadedDocs[fieldName] = {
            url: result.url,
            public_id: result.public_id,
            resource_type,
            originalName: file.originalname,
          };
        }
      }

      payload.documents = { ...payload.documents, ...uploadedDocs };
    }

    cleanEmpty(payload);

    const funding = await Funding.create(payload);

    res.status(201).json({
      success: true,
      message: "Funding created successfully",
      data: funding,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const updateFunding = async (req, res) => {
  try {
    const { id } = req.params;
    const funding = await Funding.findById(id);

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    // Prevent type change
    if (req.body.type && req.body.type !== funding.type) {
      return res.status(400).json({
        success: false,
        message: "Cannot change funding type",
      });
    }

    const payload = { ...req.body };

    payload.fundDetails = parseIfJSON(payload.fundDetails);
    payload.disclosures = parseIfJSON(payload.disclosures);
    payload.consent = parseIfJSON(payload.consent);
    payload.startup = parseIfJSON(payload.startup);
    payload.business = parseIfJSON(payload.business);
    payload.property = parseIfJSON(payload.property);
    payload.riskFactors = parseIfJSON(payload.riskFactors);

    // Handle file replacement
    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        const filesArr = req.files[fieldName];
        const file = filesArr[0];

        const { fn, resource_type } = getUploadHandler(file.mimetype);

        // Delete old file if exists
        if (funding.documents?.[fieldName]?.public_id) {
          await deleteFromCloudinary(
            funding.documents[fieldName].public_id,
            funding.documents[fieldName].resource_type
          );
        }

        const result = await fn(
          file.buffer,
          `funding/${funding.type}/documents/${fieldName}`
        );

        payload.documents = payload.documents || {};
        payload.documents[fieldName] = {
          url: result.url,
          public_id: result.public_id,
          resource_type,
          originalName: file.originalname,
        };
      }
    }

    deepMerge(funding, payload);
    cleanEmpty(funding);

    await funding.save();

    res.status(200).json({
      success: true,
      message: "Funding updated",
      data: funding,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const getAllFunding = async (req, res) => {
  try {
    const { type, status } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const data = await Funding.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const getFundingById = async (req, res) => {
  try {
    const funding = await Funding.findById(req.params.id);

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding not found",
      });
    }

    res.status(200).json({
      success: true,
      data: funding,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};


export const getFundingByUserId = async (req, res) => {
  try {
    const funding = await Funding.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });

    //send necessary details only

    const filteredData = funding.map((f) => ({
      _id: f._id,
      type: f.type,
      amount: f.fundDetails?.amount || null,
      tenure: f.fundDetails?.tenureMonths || null,
      purpose: f.fundDetails?.purpose || null,
      status: f.status,
      adminReview: f.adminReview,
      createdAt: f.createdAt,
    })); 


    res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    const { status, message } = formatErrorResponse(error);
    res.status(status).json({ success: false, message });
  }
};
