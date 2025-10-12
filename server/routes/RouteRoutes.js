import express from "express";
import {
  addNewRoute,
  getAllRoutes,
  getRouteById,
} from "../controllers/RouteController.js";
const routeRoutes = express.Router();

routeRoutes.post("/add-new-route", addNewRoute);
routeRoutes.get("/get-route-by-id/:id", getRouteById);
routeRoutes.get("/get-all-routes", getAllRoutes);

export default routeRoutes;
