import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import EmployeesModel from "../models/Employees.js";

const verifyToken = {
  checklogin: async (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }
    token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invaild Token" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }
  },
  checkAdmin: async (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }
    token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invaild Token" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // change tye req.user.id to ObjectId
      const id = new ObjectId(req.user.id);
      const admin = await EmployeesModel.findById({ _id: id });
      if (!admin) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Unauthorized" });
      }
      req.restaurant = admin.idRestaurant;
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }
    next();
  },
};

export default verifyToken;
