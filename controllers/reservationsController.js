import { StatusCodes } from "http-status-codes";
import CustomersModel from "../models/Customers.js";
import { ObjectId } from "mongodb";
import reservationsModel from "../models/Reservations.js";
import RestaurantsModel from "../models/Restaurants.js";
import tablesModel from "../models/Tables.js";
import menuModel from "../models/Menu.js";

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
      const restaurant = await RestaurantsModel.findById({ _id: idRestaurant });
      if (!restaurant)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Restaurant not found" });
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
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  updateReservation: async (req, res) => {
    try {
      const _id = new ObjectId(req.params.id);
      let { name, phoneNumber, idRestaurant, time, people, order, note } =
        req.body;
      if (!name || !phoneNumber || !idRestaurant || !time || !people) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      if (!ObjectId.isValid(idRestaurant)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid restaurant id" });
      } else idRestaurant = new ObjectId(idRestaurant);
      const reservation = await reservationsModel.findById({ _id });
      if (!reservation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Reservation not found" });
      }
      if (reservation.idRestaurant.toString() !== idRestaurant.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      }
      if (reservation.status !== 0 && reservation.status !== 1) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Cannot update reservation" });
      }
      const updateReservation = {
        name,
        phoneNumber,
        idRestaurant,
        time,
        people,
        order,
        note,
        status: 0,
      };
      await reservationsModel.findByIdAndUpdate({ _id }, updateReservation);
      res.status(StatusCodes.OK).json({ message: "Reservation updated" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad request" });
    }
  },
  getReservations: async (req, res) => {
    try {
      const idCustomer = new ObjectId(req.user.id);
      const reservations = await reservationsModel.find({ idCustomer });
      // if no reservation found, return null message
      if (reservations.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ reservations, message: "No reservation" });
      }
      // get restaurant ids from reservations
      const restaurantIds = reservations.map((item) => item.idRestaurant);
      // get restaurants by ids
      const restaurants = await RestaurantsModel.find({
        _id: { $in: restaurantIds },
      });
      // get restaurant names and addresses and phoneNumber from restaurants
      const detailReservations = reservations.map((i) => {
        const restaurant = restaurants.find(
          (i2) => i2._id.toString() === i.idRestaurant.toString()
        );
        return {
          ...i._doc,
          restaurantName: restaurant.name,
          restaurantAddress: restaurant.address,
          restaurantPhoneNumber: restaurant.phoneNumber,
        };
      });
      return res.status(StatusCodes.OK).json({
        reservations: detailReservations,
        massage: "get reservation success",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  cancelReservation: async (req, res) => {
    try {
      const { idReservation } = req.body;
      const id = idReservation;
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
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  getReservationById: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      if (!ObjectId.isValid(id)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid reservation id" });
      }
      const reservation = await reservationsModel.findById({ _id: id });
      if (!reservation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Reservation not found" });
      }
      const { order, tableIds } = reservation;
      const IdMenus = order.map((item) => item.idMenu);
      const menus = await menuModel.find({ _id: { $in: IdMenus } });
      const tables = await tablesModel.find({ _id: { $in: tableIds } });
      reservation.order = order.map((item) => {
        const menu = menus.find(
          (i) => i._id.toString() === item.idMenu.toString()
        );
        console.log(menu, item);
        return {
          name: menu.name,
          images: menu.images,
          type: menu.type,
          ...item._doc,
        };
      });
      return res.status(StatusCodes.OK).json({
        reservation,
        tables,
        menus,
        message: "get reservation success",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  },
  getReservationsByEmployee: async (req, res) => {
    try {
      const idRestaurant = new ObjectId(req.restaurant);
      const reservations = await reservationsModel.find({ idRestaurant });
      // get customer ids from reservations
      const customerIds = reservations.map((item) => item.idCustomer);
      // get customers by ids
      const customers = await CustomersModel.find({
        _id: { $in: customerIds },
      });
      // get customer names and phoneNumbers from customers
      const detailReservations = reservations.map((i) => {
        const customer = customers.find(
          (i2) => i2._id.toString() === i.idCustomer.toString()
        );
        if (!customer) return i;
        else
          return {
            ...i._doc,
            customerName: customer.name,
            customerPhoneNumber: customer.phoneNumber,
          };
      });
      return res.status(StatusCodes.OK).json({
        reservations: detailReservations,
        massage: "get reservation success",
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
  confirmReservation: async (req, res) => {
    try {
      const { idReservation } = req.body;
      const id = new ObjectId(idReservation);
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
      // check idRestaurant from req is equal to idRestaurant from reservation
      if (req.restaurant.toString() !== reservation.idRestaurant.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      }
      // check if reservation is in status 0 or 1
      if (reservation.status === 0) {
        // update reservation status to 1 (confirmed)
        await reservationsModel.findByIdAndUpdate(
          { _id: id },
          { status: 1 },
          { new: true }
        );
        // return success message
        return res
          .status(StatusCodes.OK)
          .json({ message: "Reservation confirmed" });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Cannot confirm reservation" });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }
  },
  checkInReservation: async (req, res) => {
    try {
      const { idReservation } = req.body;
      const id = new ObjectId(idReservation);
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
      // check idRestaurant from req is equal to idRestaurant from reservation
      if (req.restaurant.toString() !== reservation.idRestaurant.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      }
      // check if reservation is in status 0 or 1
      if (reservation.status === 0 || reservation.status === 1) {
        // update reservation status to 2 (checked in)
        await reservationsModel.findByIdAndUpdate(
          { _id: id },
          { status: 2 },
          { new: true }
        );
        // return success message
        return res
          .status(StatusCodes.OK)
          .json({ message: "Reservation checkined" });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Cannot checkin reservation" });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }
  },
  checkOutReservation: async (req, res) => {
    try {
      const { idReservation } = req.body;
      const id = new ObjectId(idReservation);
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
      // check idRestaurant from req is equal to idRestaurant from reservation
      if (req.restaurant.toString() !== reservation.idRestaurant.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      }
      // check if reservation is in status 2
      if (reservation.status === 2) {
        // update reservation status to 3 (checked in)
        await reservationsModel.findByIdAndUpdate(
          { _id: id },
          { status: 3 },
          { new: true }
        );
        // return success message
        return res
          .status(StatusCodes.OK)
          .json({ message: "Reservation checkouted" });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Cannot checkout reservation" });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }
  },
};

export default reservationsController;
