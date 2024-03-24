import mongoose from "mongoose";

const MenuSchema = mongoose.Schema({
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
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    require: true,
  },
});

const MenuModel = mongoose.model("Menus", MenuSchema);

export default MenuModel;
