import CustomersModel from "../models/Customers.js";
import EmployeesModel from "../models/Employees.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createAccessToken, verifyToken, decodeToken } from "../utils/index.js";

const userController = {
  createNewUser: async (req, res) => {
    try {
      // Destructure relevant fields from req.body
      const { email, password, name, phoneNumber, role } = req.body;

      // Initialize createUser object
      const createUser = {
        email,
        name,
        phoneNumber,
        role,
      };
      // Check email, name, phoneNumber, gender,  role is provided
      if (!email || !password || !name || !phoneNumber || !role) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Please provide information" });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Add hashed password to createUser object
      createUser.password = hashedPassword;

      // Create a new user instance
      let newUser = null;
      if (role === 2) newUser = new CustomersModel(createUser);
      else newUser = new EmployeesModel(createUser);

      // Save the user to the database
      await newUser.save();

      // Create access token
      const token = createAccessToken(newUser);

      // Send response
      return res
        .status(StatusCodes.CREATED)
        .json({ token, data: newUser, userId: newUser._id });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD REQUEST" });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find user by email
      let user = await CustomersModel.findOne({ email });
      if (!user) user = await EmployeesModel.findOne({ email });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });
      }
      // Check password
      let isMatch = await bcrypt.compare(password, user.password);
      if (password === user.password) isMatch = true;
      if (!isMatch) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid password" });
      }
      // Create access token
      const token = createAccessToken(user);
      return res
        .status(StatusCodes.OK)
        .json({ token, role: user.role, message: "Login successfully" });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD REQUEST" });
    }
  },
  getToken: async (req, res) => {
    try {
      // get token from header request
      // delete the 'Bearer' string
      const token = req.headers.authorization.split(" ")[1];
      // check if token is provided
      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }
      // check token is valid
      const checkToken = verifyToken(token);
      if (!checkToken) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }
      // decode token
      const decoded = decodeToken(token);
      // create new token
      const newToken = createAccessToken(decoded);
      // delete old token
      // send response
      return res
        .status(StatusCodes.OK)
        .json({ newToken, decoded, message: "Token refreshed" });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD REQUEST" });
    }
  },
  getProfile: async (req, res) => {
    try {
      const { role, id } = req.user;
      if (role === 2) {
        const customer = await CustomersModel.findById(id);
        return res.status(StatusCodes.OK).json(customer);
      } else {
        const employee = await EmployeesModel.findById(id);
        return res.status(StatusCodes.OK).json(employee);
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD REQUEST" });
    }
  },
};

export default userController;
