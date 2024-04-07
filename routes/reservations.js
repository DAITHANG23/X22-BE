import express from "express";

// Controller
import reservationsController from "../controllers/reservationsController.js";

// middlewares
import validateMiddlewares from "../middlewares/validate.js";
import checklogin from "../middlewares/verifyToken.js";
//
const reservationsRouter = express.Router();
reservationsRouter.post(
  "/",
  validateMiddlewares.deleteSpace,
  validateMiddlewares.checkPhoneNumber,
  reservationsController.createNewReservation
);
reservationsRouter.get("/", checklogin, reservationsController.getReservations);
reservationsRouter.post("/cancel", reservationsController.cancelReservation);
reservationsRouter.get("/:id", reservationsController.getReservationById);
export default reservationsRouter;
