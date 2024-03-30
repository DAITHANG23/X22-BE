import multer from "multer";
import path from "path";

// Multer configuration for handling multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Generating unique filenames
  },
});

// Define the file filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".webp", ".jpg", ".jpeg", ".png"];

  const ext = path.extname(file.originalname);
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error(
        "File type not supported. Only .webp, .jpg, .jpeg, .png files are allowed."
      ),
      false
    );
  }
};

// Multer instance with configured storage and file filter
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 }, // Limit file size to 5MB
});

export default uploadMultiple;
