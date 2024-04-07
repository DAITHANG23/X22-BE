import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const checklogin = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
  token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invaild Token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
};

export default checklogin;
