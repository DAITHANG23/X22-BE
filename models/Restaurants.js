import mongoose from "mongoose";

const RestaurantsSchema = mongoose.Schema({
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
  images: {
    type: Array,
    require: false,
  },
  avgRate: {
    type: Number,
    require: false,
  },
  type: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    require: true,
  },
  taste: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    require: true,
  },
  timeStart: {
    type: String,
    require: true,
  },
  timeEnd: {
    type: String,
    require: true,
  },
});

const RestaurantsModel = mongoose.model("Restaurants", RestaurantsSchema);

export default RestaurantsModel;
