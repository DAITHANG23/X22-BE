import { StatusCodes } from "http-status-codes";
import RestaurantsModel from "../models/Restaurants.js";
import MenuModel from "../models/Menu.js";
import { ObjectId } from "mongodb";
import removeAccents from "remove-accents";

const restaurantController = {
  createRestaurant: async (req, res) => {
    try {
      const { name, phoneNumber, address } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You need to provide the name of the restaurant",
          data: null,
        });
      }

      if (!phoneNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You need to provide the phone number of the restaurant",
          data: null,
        });
      }

      if (!address) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You need to provide the address of the restaurant",
          data: null,
        });
      }

      // Handle file upload if a file exists
      if (req.file) {
        req.body.image = req.file.path;
        req.body.imageUrl = `http://localhost:3002/${req.file.path}`;
      }

      // Create Restaurant
      const newRestaurant = await RestaurantsModel.create(req.body);

      // Save the new restaurant to the database
      const savedRestaurant = await newRestaurant.save();

      return res.status(StatusCodes.CREATED).json({
        message: "Restaurant created successfully!",
        data: savedRestaurant,
      });
    } catch (error) {
      console.error("Error creating restaurant:", error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Failed to create restaurant",
        error: error.message, // Include the error message in the response
      });
    }
  },

  getAllRestaurant: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
      const totalDocuments = await RestaurantsModel.countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);
      const skip = (page - 1) * limit;
      const allRestaurant = await RestaurantsModel.find()
        .skip(skip)
        .limit(limit);

      res.status(StatusCodes.OK).json({
        message: "Get All Restaurant Success",
        data: allRestaurant,
        meta: {
          page: page,
          limit: limit,
          totalPages: totalPages,
          totalRecords: totalDocuments,
        },
      });
    } catch (error) {
      console.error("Error get all restaurant:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getRestaurantByName: async (req, res) => {
    const { name, address } = req.query;
    try {
      let query = {}; // Khởi tạo một đối tượng truy vấn trống

      // Nếu có tên được cung cấp, thêm điều kiện tìm kiếm theo tên vào truy vấn
      if (name) {
        const nameWithoutAccents = removeAccents.remove(name);
        query.$or = [
          { name: { $regex: new RegExp(name, "i") } },
          { name: { $regex: new RegExp(nameWithoutAccents, "i") } },
        ];
      }

      // Nếu có địa chỉ được cung cấp, thêm điều kiện tìm kiếm theo địa chỉ vào truy vấn
      if (address) {
        const addressWithoutAccents = removeAccents.remove(address);

        console.log(addressWithoutAccents);
        if (!query.$or) {
          query.$or = [];
        }
        query.$or.push(
          { address: { $regex: new RegExp(address, "i") } },
          { address: { $regex: new RegExp(addressWithoutAccents, "i") } }
        );
      }

      // Thực hiện truy vấn với các điều kiện tìm kiếm
      const restaurant = await RestaurantsModel.find(query);

      if (restaurant.length === 0) {
        let message = "No restaurant found.";
        // Xây dựng thông điệp phản hồi dựa trên các trường được cung cấp
        if (name && address) {
          message = `Restaurant with name '${name}' and address '${address}' not found.`;
        } else if (name) {
          message = `Restaurant with name '${name}' not found.`;
        } else if (address) {
          message = `Restaurant with address '${address}' not found.`;
        }

        return res.status(StatusCodes.NOT_FOUND).json({
          message: message,
        });
      }

      res.status(StatusCodes.OK).json({
        message: `Get Restaurant by Name Success`,
        data: restaurant,
      });
    } catch (error) {
      console.error("Error getting restaurant by name:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  getRestaurantById: async (req, res) => {
    try {
      let { id } = req.params;
      // change id to ObjectId
      if (!ObjectId.isValid(id)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid restaurant id" });
        return;
      } else id = new ObjectId(id);
      // find restaurant by id
      const restaurant = await RestaurantsModel.findById({ _id: id });
      if (!restaurant) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Restaurant not found" });
        return;
      }
      // find menu by restaurant id and return array of menu items
      const menu = await MenuModel.find({ idRestaurant: id });
      console.log(menu);
      res
        .status(StatusCodes.OK)
        .json({ data: { restaurant, menu }, message: "Restaurant by id" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
};

export default restaurantController;
