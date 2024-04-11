import { StatusCodes } from "http-status-codes";

const validateMiddlewares = {
  checkEmail: (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide Email",
      });
      return;
    }
    // check if email is valid
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email is not valid",
      });
      return;
    }
    next();
  },
  checkPhoneNumber: (req, res, next) => {
    // Check if phone number is provided
    req.body.phoneNumber = req.body.phoneNumber.replace(/\s/g, "");
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide Phone Number",
      });
      return;
    }
    // Check if phone number is valid
    // phone number is a string of digits with length 10 or 12
    const phoneNumberRegex = /^\d{10}$|^\d{12}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Phone number is not valid",
      });
      return;
    }
    next();
  },
  checkId: (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide ID",
      });
      return;
    }
    // Check if id is valid
    // id must be a ObjectId of MongoDB
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "ID is not valid",
      });
      return;
    }
    next();
  },
  deleteSpace: (req, res, next) => {
    // Remove space from the beginning and end of the string in req.body
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
    next();
  },
};

export default validateMiddlewares;
