import express from "express";
import {
  addBus,
  updateBus,
  getBusByBusNumber,
  getBusesByStatus,
  getAllBuses,
} from "../controllers/BusController.js";
const busRouter = express.Router();

busRouter.post("/add-new-bus", addBus);
busRouter.put("/update-bus", updateBus);
busRouter.get("/get-all", getAllBuses);
busRouter.get("/get-buses-by-status", getBusesByStatus);
busRouter.get("/get-buses-by-bus-number", getBusByBusNumber);

export default busRouter;
