import { StatusCodes } from "http-status-codes";
import RestaurantsModel from "../models/Restaurants.js";
import MenuModel from "../models/Menu.js";
import { ObjectId } from "mongodb";
import removeAccents from "remove-accents";
import CustomersModel from "../models/Customers.js";
import RatingModel from "../models/Rating.js";

const restaurantController = {
  createRestaurant: async (req, res) => {
    try {
      const {
        name,
        phoneNumber,
        address,
        timeStart,
        timeEnd,
        minPrice,
        maxPrice,
      } = req.body;

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

      if (!timeStart || !timeEnd) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "You need to provide both opening and closing times of the restaurant",
          data: null,
        });
      }

      if (!minPrice || !maxPrice) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "You need to provide both minPrice and maxPrice of the restaurant",
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

    const { name, address, timeStart, timeEnd, targetPrice } = req.query;

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

      if (!query.$or) {
        query.$or = [];
      }
      query.$or.push(
        { address: { $regex: new RegExp(address, "i") } },
        { address: { $regex: new RegExp(addressWithoutAccents, "i") } }
      );
    }

    if (targetPrice) {
      query.minPrice = { $lte: targetPrice };
      query.maxPrice = { $gte: targetPrice };
    }

    if (timeStart && timeEnd) {
      query.timeStart = { $lte: timeStart };
      query.timeEnd = { $gte: timeEnd };
    }

    try {
      // const queryRestaurant = RestaurantsModel.find(query);
      const totalDocuments = await RestaurantsModel.find(
        query
      ).countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);
      const skip = (page - 1) * limit;
      const allRestaurant = await RestaurantsModel.find(query)
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

  ratingRestaurant: async (req, res) => {
    try {
      const { userId, restaurantId, ratings, comment } = req.body;

      // Kiểm tra xem người dùng có tồn tại không
      const existingUser = await CustomersModel.findById(userId);
      if (!existingUser) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });
      }

      // Kiểm tra xem nhà hàng có tồn tại không
      const existingRestaurant = await RestaurantsModel.findById(restaurantId);
      if (!existingRestaurant) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Restaurant not found" });
      }

      // Tạo một bản ghi mới cho đánh giá
      const newRating = new RatingModel({
        user: userId,
        restaurant: restaurantId,
        ratings,
        comment,
      });

      // Lưu bản ghi đánh giá vào cơ sở dữ liệu
      await newRating.save();

      // Thêm đánh giá vào nhà hàng
      existingRestaurant.ratings.push(newRating._id);
      await existingRestaurant.save();

      // Thêm đánh giá vào thông tin của người dùng
      existingUser.ratings.push(newRating._id);
      await existingUser.save();

      // Trả về thông báo thành công
      res.status(StatusCodes.OK).json({
        message: "Rate Restaurant Success",
        data: {
          id: newRating._id,
          ratings: newRating.ratings,
          comment: newRating.comment,
        },
      });
    } catch (error) {
      console.error("Error rating restaurant:", error);
      // Trả về thông báo lỗi nếu có lỗi xảy ra
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

export default restaurantController;
