import mongoose from "mongoose";
import { RestaurantType } from "./constants.js";
const RestaurantsSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: false,
  },
  imageUrl: {
    type: String,
  },
  type: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    require: false,
  },
  taste: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    require: false,
  },
  description: {
    type: String,
    require: false,
  },
  minPrice: {
    type: Number,
    require: false,
  },
  maxPrice: {
    type: Number,
    require: false,
  },
  description: {
    type: String,
    require: false,
  },
  minPrice: {
    type: Number,
    require: false,
  },
  maxPrice: {
    type: Number,
    require: false,
  },
  timeStart: {
    type: String,
    require: true,
  },
  timeEnd: {
    type: String,
    require: true,
  },
  minPrice: {
    type: Number,
    require: true,
  },
  maxPrice: {
    type: Number,
    require: true,
  },
});

const RestaurantsModel = mongoose.model("Restaurants", RestaurantsSchema);

export default RestaurantsModel;
