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

        // Tìm tất cả bus theo busNumber để lấy ObjectId
        let busIds = [];
        if (Array.isArray(buses) && buses.length > 0) {
            const foundBuses = await Bus.find({
                busNumber: { $in: buses },
            }).select("_id");

            busIds = foundBuses.map((bus) => bus._id);
        }

        // Cập nhật route — ghi đè toàn bộ mảng buses bằng danh sách mới
        const result = await Route.findOneAndUpdate(
            { routeNumber: { $regex: `^${routeNumber}$`, $options: "i" } },
            {
                ...updateData,
                buses: busIds, // ghi đè toàn bộ danh sách
            },
            { new: true }
        ).populate({
            path: "buses",
            populate: [
                { path: "driver", select: "fullName phone role" },
                { path: "students.parent", select: "fullName phone role" },
            ],
        });

        if (!result) {
            return res.json({
                success: false,
                message: "Route not found",
            });
        }

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
