import { format } from "date-fns";
import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: Number,
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
  rate: {
    type: Number,
    require: false,
  },
  createdAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
  updatedAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
});

const RestaurantModel = mongoose.model("restaurants", RestaurantSchema);

export default RestaurantModel;
