import express from "express";

// Controller
import tablesController from "../controllers/tablesController.js";
// middlewares
import verifyToken from "../middlewares/verifyToken.js";
//
const tablesRouter = express.Router();

tablesRouter.post("/", verifyToken.checkAdmin, tablesController.getTables);

export default tablesRouter;
