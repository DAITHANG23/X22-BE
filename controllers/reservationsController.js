import { StatusCodes } from "http-status-codes";
import CustomersModel from "../models/Customers.js";
import { ObjectId } from "mongodb";
import reservationsModel from "../models/Reservations.js";

const reservationsController = {
  createNewReservation: async (req, res) => {
    try {
      let {
        name,
        phoneNumber,
        idRestaurant,
        idCustomer,
        time,
        people,
        order,
        note,
      } = req.body;
      // change idRestaurant to ObjectId
      if (!ObjectId.isValid(idRestaurant)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid restaurant id" });
      } else idRestaurant = new ObjectId(idRestaurant);
      // change idCustomer to ObjectId
      if (idCustomer && !ObjectId.isValid(idCustomer)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid customer id" });
      } else if (idCustomer) idCustomer = new ObjectId(idCustomer);
      // if idCustomer is provided, check if it is a valid ObjectId
      let user;
      if (idCustomer) user = await CustomersModel.findById({ _id: idCustomer });
      name = user ? user.name : name;
      phoneNumber = user ? user.phoneNumber : phoneNumber;
      // check name, phoneNumber, idRestaurant, time, people are provided
      if (!name || !phoneNumber || !idRestaurant || !time || !people) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      // create new reservation
      const newReservation = {
        name,
        phoneNumber,
        idRestaurant,
        idCustomer,
        time,
        people,
        order,
        note,
        status: 0,
      };
      // save new reservation to database
      const reservation = await reservationsModel.create(newReservation);
      // return success message
      res.status(StatusCodes.CREATED).json({
        message: "Reservation created successfully",
        reservation,
      });
    } catch (error) {
      console.log(error);
      req
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  getReservations: async (req, res) => {
    try {
      const reservations = await reservationsModel.find();
      res.status(StatusCodes.OK).json({ reservations });
    } catch (error) {
      console.log(error);
      req
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  cancelReservation: async (req, res) => {
    try {
      const { id } = req.params;
      // check if id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid reservation id" });
      }
      // find reservation by id
      const reservation = await reservationsModel.findById({ _id: id });
      // check if reservation exists
      if (!reservation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Reservation not found" });
      }
      // check if reservation is in status 0 or 1
      if (reservation.status === 0 || reservation.status === 1) {
        // update reservation status to 4 (cancelled)
        await reservationsModel.findByIdAndUpdate(
          { _id: id },
          { status: 4 },
          { new: true }
        );
        // return success message
        return res
          .status(StatusCodes.OK)
          .json({ message: "Reservation cancelled" });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Cannot cancel reservation" });
      }
    } catch (error) {
      console.log(error);
      req
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
};

export default reservationsController;
