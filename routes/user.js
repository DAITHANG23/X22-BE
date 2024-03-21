import express from "express";

// Controller
import userController from "../controllers/userController.js";

// middlewares
import middlewares from "../middlewares/index.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  middlewares.register,
  userController.createNewUser
);
userRouter.post("/login", middlewares.login, userController.loginUser);
export default userRouter;
