import express from "express";

// Controller
import tablesController from "../controllers/tablesController.js";
// middlewares
import verifyToken from "../middlewares/verifyToken.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../middlewares/cloudinary.config.js";
import multer from "multer";
//
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "restaurant",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

const upload = multer({
  storage: storage,
});

const tablesRouter = express.Router();

tablesRouter.get("/menu", verifyToken.checkAdmin, tablesController.getMenu);
tablesRouter.post(
  "/menu",
  verifyToken.checkAdmin,
  upload.array("images", 5),
  tablesController.createMenu
);
tablesRouter.put("/menu", verifyToken.checkAdmin, tablesController.editMenu);
tablesRouter.delete(
  "/menu/:idMenu",
  verifyToken.checkAdmin,
  tablesController.deleteMenu
);
tablesRouter.get("/", verifyToken.checkAdmin, tablesController.getAllTables);
tablesRouter.post("/", verifyToken.checkAdmin, tablesController.getTables);
tablesRouter.post(
  "/new",
  verifyToken.checkAdmin,
  tablesController.createTables
);
tablesRouter.put("/:id", verifyToken.checkAdmin, tablesController.editTables);

export default tablesRouter;
