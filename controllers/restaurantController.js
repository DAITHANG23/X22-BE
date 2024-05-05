import { StatusCodes } from "http-status-codes";
import RestaurantsModel from "../models/Restaurants.js";
import MenuModel from "../models/Menu.js";
import { ObjectId } from "mongodb";
import removeAccents from "remove-accents";
import CustomersModel from "../models/Customers.js";
import RatingModel from "../models/Rating.js";
import cloudinary from "../middlewares/cloudinary.config.js";
import mongoose from "mongoose";

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
        description,
        type,
      } = req.body;
      const files = req.files;

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

      if (!description) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You need to provide the description of the restaurant",
          data: null,
        });
      }

      if (!type) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You need to provide the type of the restaurant",
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

      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        })
      );

      // Create Restaurant
      const newRestaurant = await RestaurantsModel.create({
        name,
        phoneNumber,
        address,
        timeStart,
        timeEnd,
        minPrice,
        maxPrice,
        description,
        type,
        images: imageUrls, // Push the image URL to the image array
      });

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

  editRestaurant: async (req, res) => {
    try {
      const { id } = req.params; // Extract restaurant ID from URL params
      const {
        name,
        phoneNumber,
        address,
        timeStart,
        timeEnd,
        minPrice,
        maxPrice,
        description,
        type,
      } = req.body;
      const files = req.files; // Assuming you're uploading new images

      // Validate that at least one field is being updated
      if (
        !name &&
        !phoneNumber &&
        !address &&
        !timeStart &&
        !timeEnd &&
        !minPrice &&
        !maxPrice &&
        !description &&
        !type &&
        (!files || files.length === 0) // No files uploaded
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "At least one field or image is required for update",
          data: null,
        });
      }

      // If files are uploaded, upload them to Cloudinary and get image URLs
      let imageUrls = [];
      if (files && files.length > 0) {
        imageUrls = await Promise.all(
          files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          })
        );
      }

      // Find the restaurant by ID and update its information
      const updatedRestaurant = await RestaurantsModel.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            phoneNumber,
            address,
            timeStart,
            timeEnd,
            minPrice,
            maxPrice,
            description,
            type,
            $push: { images: { $each: imageUrls } }, // Add new image URLs to the images array
          },
        },
        { new: true } // Return the updated document
      );

      // Check if the restaurant exists
      if (!updatedRestaurant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Restaurant not found",
          data: null,
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "Restaurant updated successfully",
        data: updatedRestaurant,
      });
    } catch (error) {
      console.error("Error updating restaurant:", error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Failed to update restaurant",
        error: error.message,
      });
    }
  },

  getAllRestaurant: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { name, address, type, minPrice, maxPrice } = req.query;

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

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by minPrice and maxPrice
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.minPrice = { $gte: minPrice };
      query.maxPrice = { $lte: maxPrice };
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

      if (ratings < 1 || ratings > 5) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Rating must be in range",
        });
      }

      if (comment?.length > 256) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Comment must be in range",
        });
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

      const getAllRating = await RatingModel.aggregate([
        { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
        {
          $group: {
            _id: null,
            avgRate: { $avg: "$ratings" },
            reviews: { $sum: 1 },
          },
        },
      ]);

      // Update the restaurant document with new average rating and total reviews
      if (getAllRating.length > 0) {
        const avgRate = getAllRating[0].avgRate;
        const reviews = getAllRating[0].reviews;

        // Update the restaurant document
        await RestaurantsModel.findByIdAndUpdate(restaurantId, {
          avgRate,
          reviews,
        });
      }

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

  getAllRatingByRestaurantId: async (req, res) => {
    try {
      const { restaurantId } = req.params;

      // Find all ratings for the specified restaurant ID
      const ratings = await RatingModel.find({
        restaurant: restaurantId,
      })
        .populate("user", "name")
        .sort({ createdAt: -1 });

      // Return the ratings
      res.status(StatusCodes.OK).json({
        message: "All Ratings Retrieved Successfully",
        data: ratings,
      });
    } catch (error) {
      console.error("Error retrieving ratings:", error);
      // Return an error message if there's an error
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getTopRestaurants: async (req, res) => {
    try {
      // Fetch top 15 restaurants based on avgRate
      const topRestaurants = await RestaurantsModel.find()
        .sort({ avgRate: -1 }) // Sort in descending order based on avgRate
        .limit(15); // Limit to 15 restaurants

      // Return the top restaurants
      res.status(StatusCodes.OK).json({
        message: "Top 15 restaurants based on avgRate",
        data: topRestaurants,
      });
    } catch (error) {
      console.error("Error fetching top restaurants:", error);
      // Return error message if an error occurs
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

export default restaurantController;
