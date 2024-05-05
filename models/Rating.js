import mongoose from "mongoose";
import { format } from "date-fns";

const RatingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  ratings: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    require: false,
  },
  createdAt: {
    type: String,
    default: () => format(new Date(), "MMM dd, yyyy, p"),
  },
});

const RatingModel = mongoose.model("Ratings", RatingSchema);

export default RatingModel;
