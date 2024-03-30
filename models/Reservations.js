import mongoose from "mongoose";

const ReservationsSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  idRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    require: true,
  },
  idCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    require: false,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    require: true,
  },
  people: {
    type: Number,
    require: true,
  },
  order: {
    type: Array,
    require: false,
  },
  tableIds: {
    type: Array,
    require: false,
  },
  note: {
    type: String,
    require: false,
  },
  time: {
    type: Date,
    require: true,
  },
});

const ReservationsModel = mongoose.model("Reservations", ReservationsSchema);

export default ReservationsModel;
