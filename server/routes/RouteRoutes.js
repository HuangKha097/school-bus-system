import express from "express";
import {
    addNewRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    findRouteByName,
} from "../controllers/RouteController.js";
const routeRoutes = express.Router();

routeRoutes.post("/add-new-route", addNewRoute);
routeRoutes.get("/get-route-by-id/:id", getRouteById);
routeRoutes.get("/get-all-routes", getAllRoutes);
routeRoutes.put("/update-route", updateRoute);
routeRoutes.get("/get-route-by-route-number", findRouteByName);

export default routeRoutes;
