import Route from "../models/RouteModel.js";
import Bus from "../models/BusModel.js";

// Thêm tuyến đường mới

export const addNewRoute = async (req, res) => {
    const { name, routeNumber, latitude, longitude, time } = req.body;

    try {
        if (!name || !routeNumber || !latitude || !longitude || !time) {
            return res.json({
                success: false,
                message: "All fields are required",
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
            message: "Route created successfully",
            result,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// Lấy toàn bộ tuyến đường

export const getAllRoutes = async (req, res) => {
    try {
        const result = await Route.find().populate({
            path: "buses",
            populate: [
                { path: "driver", select: "fullName phone role" },
                {
                    path: "students",
                    populate: { path: "parent", select: "fullName phone role" },
                },
            ],
        });

        return res.json({
            success: true,
            message: "Get all routes successfully",
            result,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

//Lấy tuyến đường theo ID

export const getRouteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Route.findById(id).populate({
            path: "buses",
            populate: [
                { path: "driver", select: "fullName phone role" },
                {
                    path: "students",
                    populate: { path: "parent", select: "fullName phone role" },
                },
            ],
        });

        if (!result) {
            return res.json({
                success: false,
                message: "Route does not exist",
            });
        }

        return res.json({
            success: true,
            message: "Get route successfully",
            result,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// Cập nhật tuyến đường

export const updateRoute = async (req, res) => {
    try {
        const { routeNumber, buses = [], ...updateData } = req.body;

        if (!routeNumber) {
            return res.status(400).json({
                success: false,
                message: "Route number is required",
            });
        }

        //Tìm route cũ theo routeNumber
        const oldRoute = await Route.findOne({ routeNumber });
        if (!oldRoute) {
            return res.json({
                success: false,
                message: "Route not found",
            });
        }

        //Lấy danh sách ObjectId của các bus mới
        let busIds = [];
        if (Array.isArray(buses) && buses.length > 0) {
            // Nếu phần tử đầu là ObjectId dạng string 24 ký tự → hiểu là _id
            if (
                typeof buses[0] === "string" &&
                /^[0-9a-fA-F]{24}$/.test(buses[0])
            ) {
                busIds = buses;
            } else {
                // Nếu là busNumber
                const foundBuses = await Bus.find({
                    busNumber: { $in: buses },
                }).select("_id busNumber");
                busIds = foundBuses.map((bus) => bus._id);
            }
        }

        //Lấy danh sách bus cũ
        const oldBusIds = oldRoute.buses.map((id) => id.toString());
        const newBusIds = busIds.map((id) => id.toString());

        //Các bus bị gỡ khỏi tuyến
        const removedBusIds = oldBusIds.filter((id) => !newBusIds.includes(id));

        //Các bus mới được thêm vào tuyến
        const addedBusIds = newBusIds.filter((id) => !oldBusIds.includes(id));

        //Cập nhật routeNumber = null cho bus bị gỡ
        if (removedBusIds.length > 0) {
            await Bus.updateMany(
                { _id: { $in: removedBusIds } },
                { $set: { routeNumber: null } }
            );
        }

        //Cập nhật routeNumber cho bus mới thêm vào
        if (addedBusIds.length > 0) {
            await Bus.updateMany(
                { _id: { $in: addedBusIds } },
                { $set: { routeNumber } }
            );
        }

        //Cập nhật lại route, ghi đè danh sách buses
        const result = await Route.findOneAndUpdate(
            { routeNumber },
            {
                ...updateData,
                buses: busIds,
            },
            { new: true }
        ).populate({
            path: "buses",
            populate: [
                { path: "driver", select: "fullName phone role" },
                { path: "students.parent", select: "fullName phone role" },
            ],
        });

        return res.json({
            success: true,
            message: "Route updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error updating route:", error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const findRouteByName = async (req, res) => {
    try {
        const { routeNumber } = req.query;

        if (!routeNumber) {
            return res.json({
                success: false,
                message: "Missing routeNumber",
            });
        }

        const result = await Route.findOne({ routeNumber });
        if (!result) {
            return res.json({
                success: false,
                message: "Route does not exist",
            });
        }

        return res.json({
            success: true,
            message: "Route found successfully",
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};
