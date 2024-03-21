import mongoose from "mongoose";

const TablesSchema = mongoose.Schema({
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    require: true,
  },
  status: {
    type: Number,
    enum: [1, 2, 0],
    require: true,
  },
  capacity: {
    type: Number,
    require: true,
  },
  tableNumber: {
    type: Number,
    require: false,
  },
});

const TablesModel = mongoose.model("Tables", TablesSchema);

export default TablesModel;
