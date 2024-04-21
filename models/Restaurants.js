import mongoose from "mongoose";
import { format } from "date-fns";

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
  images: [String],
  type: {
    type: String,
    enum: ["euro", "china", "vietnam", "japan", "korean"],
    required: false,
  },
  avgRate: Number,
  reviews: Number,
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
  createdAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
  updatedAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
});

const RestaurantsModel = mongoose.model("Restaurants", RestaurantsSchema);

export default RestaurantsModel;
