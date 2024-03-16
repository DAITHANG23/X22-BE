import multer from "multer";
import path from "path";

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 MB limit
  },
  fileFilter: fileFilter,
});

export { upload };
