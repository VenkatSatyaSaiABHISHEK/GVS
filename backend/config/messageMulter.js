import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = "uploads/messages/";
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `attachment-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const allowedExtensions = /\.(jpg|jpeg|png|gif|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip)$/i;

const fileFilter = (req, file, cb) => {
  if (!allowedExtensions.test(file.originalname)) {
    return cb(new Error("Unsupported attachment type"), false);
  }
  cb(null, true);
};

export const uploadMessageAttachment = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
