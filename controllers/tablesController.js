import TablesModel from "../models/Tables.js";
import StatusCodes from "http-status-codes";
import { ObjectId } from "mongodb";
import reservationsModel from "../models/Reservations.js";

const tablesController = {
  getTables: async (req, res) => {
    try {
      // get id from req.Restaurant
      const idRestaurant = req.restaurant;
      // get idReservation from req.body
      let { idReservation } = req.body;
      // check if idReservation is provided
      if (!idReservation) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      // change idReservation to ObjectId
      if (!ObjectId.isValid(idReservation)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid reservation id" });
      } else idReservation = new ObjectId(idReservation);
      // check if reservation exists
      const reservation = await reservationsModel.findById({
        _id: idReservation,
      });
      if (!reservation)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Reservation not found" });
      // check if reservation is in the same restaurant
      if (reservation.idRestaurant.toString() !== idRestaurant.toString())
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      // get tables from database
      const tables = await TablesModel.find({ idRestaurant });
      res.json({ tables, message: "Get tables successfully" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
};

export default tablesController;
