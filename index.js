import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//import routes
import userRouter from "./routes/user.js";
import restaurantRouter from "./routes/restaurant.js";
import reservationsRouter from "./routes/reservations.js";
// ENV
dotenv.config();
const port = process.env.PORT || 3003;
process.env.JWT_SECRET;

// Mongo atlas
const app = express();
mongoose.connect(process.env.MONGODB_URL);
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/user", userRouter);
app.use("/restaurant", restaurantRouter);
app.use("/reservations", reservationsRouter);
//
app.listen(port, () => {
  console.log(`Server has been run on port ${port}!`);
});
// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log(`Exit Server Express`);
//   });
// });
