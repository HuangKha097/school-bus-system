import express from "express";
import {
    addBus,
    updateBus,
    getBusByBusNumber,
    getBusesByStatus,
    getAllBuses,
    getBusByRouteNumber,
    getBusesById,
} from "../controllers/BusController.js";
const busRouter = express.Router();

busRouter.post("/add-new-bus", addBus);
busRouter.put("/update-bus", updateBus);
busRouter.get("/get-all", getAllBuses);
busRouter.get("/get-buses-by-status", getBusesByStatus);
busRouter.get("/get-buses-by-busId", getBusesById);
busRouter.get("/get-buses-by-bus-number", getBusByBusNumber);
busRouter.get("/get-buses-by-route-number", getBusByRouteNumber);

export default busRouter;
