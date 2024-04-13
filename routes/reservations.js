import express from "express";

// Controller
import reservationsController from "../controllers/reservationsController.js";

// middlewares
import validateMiddlewares from "../middlewares/validate.js";
import verifyToken from "../middlewares/verifyToken.js";
//
const reservationsRouter = express.Router();

reservationsRouter.post(
  "/",
  validateMiddlewares.deleteSpace,
  validateMiddlewares.checkPhoneNumber,
  reservationsController.createNewReservation
);

reservationsRouter.get(
  "/",
  verifyToken.checklogin,
  reservationsController.getReservations
);

reservationsRouter.post("/cancel", reservationsController.cancelReservation);

reservationsRouter.get(
  "/employee",
  verifyToken.checkAdmin,
  reservationsController.getReservationsByEmployee
);

reservationsRouter.post(
  "/employee/confirm",
  verifyToken.checkAdmin,
  reservationsController.confirmReservation
);

reservationsRouter.post(
  "/checkin",
  verifyToken.checkAdmin,
  reservationsController.checkInReservation
);

reservationsRouter.post(
  "/checkout",
  verifyToken.checkAdmin,
  reservationsController.checkOutReservation
);

reservationsRouter.put("/:id", reservationsController.updateReservation);

reservationsRouter.get("/:id", reservationsController.getReservationById);

export default reservationsRouter;
