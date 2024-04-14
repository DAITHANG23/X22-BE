import mongoose from "mongoose";
import { format } from "date-fns";

const ReviewsSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: false,
  },
  idCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    require: false,
  },
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    require: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
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

const ReviewsModel = mongoose.model("Reviews", ReviewsSchema);

export default ReviewsModel;
