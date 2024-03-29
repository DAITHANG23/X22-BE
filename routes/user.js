import express from "express";

// Controller
import userController from "../controllers/userController.js";

// middlewares
import middlewares from "../middlewares/user.js";
import validateMiddlewares from "../middlewares/validate.js";
const userRouter = express.Router();

userRouter.post(
  "/register",
  validateMiddlewares.deleteSpace,
  validateMiddlewares.checkEmail,
  validateMiddlewares.checkPhoneNumber,
  middlewares.register,
  userController.createNewUser
);
userRouter.post(
  "/login",
  validateMiddlewares.deleteSpace,
  validateMiddlewares.checkEmail,
  middlewares.login,
  userController.loginUser
);
userRouter.get("/token", userController.getToken);
export default userRouter;
