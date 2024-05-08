import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../middlewares/cloudinary.config.js";
import multer from "multer";

// Controller
import restaurantController from "../controllers/restaurantController.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "restaurant",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

const upload = multer({
  storage: storage,
});

const restaurantRouter = express.Router();

// CREATE
restaurantRouter.post(
  "/create",
  upload.array("images", 5),
  restaurantController.createRestaurant
);

// EDIT RESTAURANT
restaurantRouter.put(
  "/:id",
  upload.array("images", 5),
  restaurantController.editRestaurant
);

// GET ALL restaurant
restaurantRouter.get("/", restaurantController.getAllRestaurant);

// GET 15 top restaurants
restaurantRouter.get("/top", restaurantController.getTopRestaurants);

// GET RESTAURANT BY ID
restaurantRouter.get("/:id", restaurantController.getRestaurantById);

// rating
restaurantRouter.post("/reviews", restaurantController.ratingRestaurant);

// Get All Rating By Restaurant
restaurantRouter.get(
  "/reviews/:restaurantId",
  restaurantController.getAllRatingByRestaurantId
);

export default restaurantRouter;
