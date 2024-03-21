import mongoose from "mongoose";

const EmployeesSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  gender: {
    type: Number,
    enum: [0, 1, 2],
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
  role: {
    type: Number,
    enum: [0, 1, 2],
    require: true,
  },
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    require: true,
  },
});

const EmployeesModel = mongoose.model("Employees", EmployeesSchema);

export default EmployeesModel;
