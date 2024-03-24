import express from "express";

// Controller
import reservationsController from "../controllers/reservationsController.js";

// middlewares
import validateMiddlewares from "../middlewares/validate.js";
//
const reservationsRouter = express.Router();
reservationsRouter.post(
  "/",
  validateMiddlewares.deleteSpace,
  validateMiddlewares.checkPhoneNumber,
  reservationsController.createNewReservation
);
reservationsRouter.get("/:id", reservationsController.cancelReservation);
export default reservationsRouter;
