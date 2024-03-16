import UserModel from "../models/User.js";
import { StatusCodes } from "http-status-codes";

const middlewares = {
  register: async (req, res, next) => {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please provide information",
        });
        return;
      }
      const existedEmail = await UserModel.findOne({ email });
      //   Check Email existed
      if (!!existedEmail) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Email has been existed!",
        });
        return;
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
      return;
    }
    next();
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide email or password",
      });
      return;
    }
    next();
  },
};

export default middlewares;
