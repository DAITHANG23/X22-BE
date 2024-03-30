import mongoose from "mongoose";
import { format } from "date-fns";

const RatingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
});

const RatingModel = mongoose.model("ratings", RatingSchema);

export default RatingModel;
