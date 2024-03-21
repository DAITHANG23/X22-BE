import express from "express";

// Controller
import restaurantController from "../controllers/restaurantController.js";

// middlewares
import middlewares from "../middlewares/index.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/", restaurantController.getAllRestaurants);
restaurantRouter.get("/:id", restaurantController.getRestaurantById);

export default restaurantRouter;
