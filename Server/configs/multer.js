import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "video/mp4",
      "video/mpeg",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Unsupported file type"), false);
    } else {
      cb(null, true);
    }
  },
});
export default upload;