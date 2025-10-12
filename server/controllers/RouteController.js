import Route from "../models/RouteModel.js";

export const addNewRoute = async (req, res) => {
  // stop {[ latitude, longitude, time ]}
  const { name, routeNumber, latitude, longitude, time } = req.body;
  try {
    if (!name || !routeNumber || !latitude || !longitude || !time) {
      return res.json({
        success: false,
        messege: "The in put is required",
      });
    }
    const result = await Route.create({
      name,
      routeNumber,
      latitude,
      longitude,
      time,
    });

    return res.json({
      success: true,
      messege: "Create route successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      messege: error,
    });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const result = await Route.findById(req.params);
    if (!result) {
      return res.json({
        success: false,
        messege: "Route does not exist",
      });
    }
    return res.json({
      success: true,
      messege: "Get successfully",
      result,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      messege: error.messege,
    });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const result = await Route.find();
    return res.json({
      success: true,
      messege: "Get successfully",
      result,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      messege: error.messege,
    });
  }
};
