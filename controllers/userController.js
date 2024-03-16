import UserModel from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createAccessToken } from "../utils/index.js";

const userController = {
  createNewUser: async (req, res) => {
    try {
      // Destructure relevant fields from req.body
      const { email, password, fullName, phoneNumber, gender, address, role } =
        req.body;

      // Initialize createUser object
      const createUser = {
        email,
        fullName,
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
      const newUser = new UserModel(createUser);

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
};

export default userController;
