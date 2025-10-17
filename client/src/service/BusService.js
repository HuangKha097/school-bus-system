import axios from "axios";

export const getAll = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/bus/get-all");
        return res.data;
    } catch (error) {
        console.error("Get data error:", error);
        throw error;
    }
};
export const getBusesByStatus = async (status) => {
    try {
        const res = await axios.get(
            "http://localhost:5000/api/bus/get-buses-by-status",
            { params: { status } }
        );
        return res.data;
    } catch (error) {
        console.error("Get data error:", error);
        throw error;
    }
};
export const getBusesByBusNumber = async (busNumber) => {
    try {
        const res = await axios.get(
            "http://localhost:5000/api/bus/get-buses-by-bus-number",
            { params: { busNumber } }
        );
        return res.data;
    } catch (error) {
        console.error("Get data error:", error);
        throw error;
    }
};
export const getBusesByRouteNumber = async (routeNumber) => {
    try {
        const res = await axios.get(
            "http://localhost:5000/api/bus/get-buses-by-route-number",
            { params: { routeNumber } }
        );
        return res.data;
    } catch (error) {
        console.error("Get data error:", error);
        throw error;
    }
};
export const updateBus = async (data) => {
    try {
        const res = await axios.put(
            "http://localhost:5000/api/bus/update-bus",
            data
        );
        return res.data;
    } catch (error) {
        console.error("Update error:", error);
        throw error;
    }
};
