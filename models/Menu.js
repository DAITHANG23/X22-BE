import mongoose from "mongoose";

const MenuSchema = mongoose.Schema({
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: false,
  },
  type: {
    type: Number,
    enum: [1, 2, 0],
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  discount: {
    type: Number,
    require: false,
  },
});

const MenuModel = mongoose.model("Menu", MenuSchema);

export default MenuModel;
