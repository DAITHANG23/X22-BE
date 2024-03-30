import express from "express";

// middlewares
import { upload } from "../middlewares/upload.js";

// Controller
import restaurantController from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

// CREATE
restaurantRouter.post(
  "/create",
  upload.single("image"),
  restaurantController.createRestaurant
);

// GET ALL restaurant
restaurantRouter.get("/", restaurantController.getAllRestaurant);

restaurantRouter.get("/search", restaurantController.getRestaurantByName);

restaurantRouter.get("/:id", restaurantController.getRestaurantById);

export default restaurantRouter;
