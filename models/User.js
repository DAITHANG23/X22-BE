import { format } from "date-fns";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: false,
  },
  avatar: {
    type: String,
    require: false,
  },
  avatarUrl: {
    type: String,
  },
  role: {
    type: String,
    // FIX ME: Have role client, staff, admin
    default: "client",
    require: false,
  },
  restaurant: [
    {
      restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurants",
      },
    },
  ],
  // SAVE THE RATING
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",
    },
  ],
  createdAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
  updatedAt: {
    type: String,
    default: format(new Date(), "MMM dd, yyyy, p"),
  },
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
