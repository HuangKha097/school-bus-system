import Bus from "../models/BusModel.js";

export const addBus = async (req, res) => {
    const {
        busNumber,
        licensePlate,
        capacity,
        routeNumber,
        busStatus,
        driver,
        route,
        students,
    } = req.body;

    try {
        if (!busNumber || !capacity || !licensePlate) {
            return res.json({
                success: false,
                message: "The input is required",
            });
        }

        // Kiểm tra trùng số xe
        const checkBus = await Bus.findOne({ busNumber });
        if (checkBus) {
            return res.json({
                success: false,
                message: "Bus number already exists",
            });
        }

        const newBus = await Bus.create({
            busNumber,
            licensePlate,
            capacity,
            routeNumber: routeNumber || "",
            busStatus: busStatus || "Đang chạy",
            driver: driver || null,
            route: route || null,
            students: Array.isArray(students) ? students : [],
        });

        const populatedBus = await Bus.findById(newBus._id)
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        return res.json({
            success: true,
            message: "Add bus successfully",
            data: populatedBus,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const updateBus = async (req, res) => {
    try {
        const { busNumber, ...updateData } = req.body;

        if (!busNumber) {
            return res.status(400).json({
                success: false,
                message: "Bus number is required",
            });
        }

        const updatedBus = await Bus.findOneAndUpdate(
            { busNumber: { $regex: `^${busNumber}$`, $options: "i" } },
            updateData,
            { new: true }
        )
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        if (!updatedBus) {
            return res.json({
                success: false,
                message: "Bus not found",
            });
        }

        return res.json({
            success: true,
            message: "Bus updated successfully",
            data: updatedBus,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllBuses = async (req, res) => {
    try {
        const data = await Bus.find()
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        return res.json({
            success: true,
            message: "Get all buses successfully",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const getBusesById = async (req, res) => {
    try {
        const { busId } = req.query;
        if (!busId) {
            return res.json({ success: false, message: "busId is required" });
        }

        const data = await Bus.find({ _id: busId })
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        return res.json({
            success: true,
            message: "Get buses successfully",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};
export const getBusesByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) {
            return res.json({ success: false, message: "Status is required" });
        }

        const data = await Bus.find({ busStatus: status })
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        return res.json({
            success: true,
            message: "Get buses successfully",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const getBusByBusNumber = async (req, res) => {
    try {
        const { busNumber } = req.query;
        if (!busNumber) {
            return res.json({
                success: false,
                message: "Bus number is required",
            });
        }

        const data = await Bus.findOne({
            busNumber: { $regex: `^${busNumber}$`, $options: "i" },
        })
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        if (!data) {
            return res.json({ success: false, message: "Bus not found" });
        }

        return res.json({
            success: true,
            message: "Get bus successfully",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};
export const getBusByRouteNumber = async (req, res) => {
    try {
        const { routeNumber } = req.query;
        if (!routeNumber) {
            return res.json({
                success: false,
                message: "Route Number is required",
            });
        }

        const data = await Bus.findOne({
            routeNumber: { $regex: `^${routeNumber}$`, $options: "i" },
        })
            .populate("driver", "fullName phone role")
            .populate("students.parent", "fullName phone role");

        if (!data) {
            return res.json({ success: false, message: "Bus not found" });
        }

        return res.json({
            success: true,
            message: "Get bus successfully",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};
