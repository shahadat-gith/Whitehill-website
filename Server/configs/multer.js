import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/webp",

      // PDFs
      "application/pdf",

      // Word
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      // Excel
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      // Videos
      "video/mp4",
      "video/mpeg",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"), false);
    }

    cb(null, true);
  },
});

export default upload;