import CustomersModel from "../models/Customers.js";
import EmployeesModel from "../models/Employees.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createAccessToken } from "../utils/index.js";

const userController = {
  createNewUser: async (req, res) => {
    try {
      // Destructure relevant fields from req.body
      const { email, password, name, phoneNumber, gender, address, role } =
        req.body;

      // Initialize createUser object
      const createUser = {
        email,
        name,
        phoneNumber,
        gender,
        address,
        role,
      };

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
      res
        .status(StatusCodes.CREATED)
        .json({ token, data: newUser, userId: newUser._id });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find user by email
      let user = await CustomersModel.findOne({ email });
      if (!user) user = await EmployeesModel.findOne({ email });
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        return;
      }
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid password" });
        return;
      }
      // Create access token
      const token = createAccessToken(user);
      res.status(StatusCodes.OK).json({ token, message: "Login successfully" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
};

export default userController;
