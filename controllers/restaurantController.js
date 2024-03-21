import { StatusCodes } from "http-status-codes";
import RestaurantsModel from "../models/Restaurants.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../utils/index.js";
import { ObjectId } from "mongodb";

const restaurantController = {
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await RestaurantsModel.find();
      res
        .status(StatusCodes.OK)
        .json({ data: restaurants, message: "All restaurants" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
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
      res
        .status(StatusCodes.OK)
        .json({ data: restaurant, message: "Restaurant by id" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
};

export default restaurantController;
