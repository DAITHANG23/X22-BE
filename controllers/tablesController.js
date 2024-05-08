import TablesModel from "../models/Tables.js";
import MenuModel from "../models/Menu.js";
import StatusCodes from "http-status-codes";
import { ObjectId } from "mongodb";
import reservationsModel from "../models/Reservations.js";
import cloudinary from "../middlewares/cloudinary.config.js";

const tablesController = {
  getMenu: async (req, res) => {
    try {
      // get id from req.Restaurant
      const idRestaurant = req.restaurant;
      // get menu from id
      const menus = await MenuModel.find({ idRestaurant });
      res.json({ menus, message: "Get tables successfully" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
  createMenu: async (req, res) => {
    try {
      // get id from req.Restaurant
      const idRestaurant = req.restaurant;
      // get data from req.body
      const { type, name, discount, price } = req.body;
      // check if required fields are provided
      if (!type || !name || !price) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      // check if images is provided
      const files = req.files;
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        })
      );
      console.log(files);
      // create new menu
      const newMenu = new MenuModel({
        idRestaurant,
        type,
        name,
        images: imageUrls[0],
        discount,
        price,
      });

      // save new menu to database
      await newMenu.save();
      res.json({ message: "Create menu successfully" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
  editMenu: async (req, res) => {},
  deleteMenu: async (req, res) => {
    try {
      // get id from req.Restaurant
      const idRestaurant = req.restaurant;
      // get idMenu from req.params
      let { idMenu } = req.params;
      // check if idMenu is provided
      if (!idMenu) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      // change idMenu to ObjectId
      if (!ObjectId.isValid(idMenu)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid menu id" });
      } else idMenu = new ObjectId(idMenu);
      // check if menu exists
      const menu = await MenuModel.findById({ _id: idMenu });
      if (!menu)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Menu not found" });
      // check if menu is in the same restaurant
      if (menu.idRestaurant.toString() !== idRestaurant.toString())
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      // delete menu from database
      await MenuModel.deleteOne({ _id: idMenu });
      res.json({ message: "Delete menu successfully" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
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
  getAllTables: async (req, res) => {
    try {
      // get id from req.Restaurant
      const idRestaurant = req.restaurant;
      // get tables from database
      const tables = await TablesModel.find({ idRestaurant });
      res.json({ tables, message: "Get tables successfully" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
  createTables: async (req, res) => {
    try {
      const idRestaurant = req.restaurant;
      const { tableNumber, capacity } = req.body;
      if (!tableNumber || !capacity) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      const newTable = new TablesModel({
        idRestaurant,
        tableNumber,
        capacity,
        status: 0,
      });
      await newTable.save();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
  editTables: async (req, res) => {
    try {
      const idRestaurant = req.restaurant;
      let { id } = req.params;
      const { tableNumber, capacity } = req.body;
      if (!id || !tableNumber || !capacity) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing required fields" });
      }
      if (!ObjectId.isValid(id)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid table id" });
      } else id = new ObjectId(id);
      const table = await TablesModel.findById({ _id: id });
      if (!table)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Table not found" });
      if (table.idRestaurant.toString() !== idRestaurant.toString())
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
      await TablesModel.updateOne({ _id: id }, { tableNumber, capacity });
      res.json({ message: "Edit table successfully" });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD_REQUEST" });
    }
  },
};

export default tablesController;
