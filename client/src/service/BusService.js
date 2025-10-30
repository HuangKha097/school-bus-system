import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL_BUS;

// BUS API
export const getAll = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/get-all`);
        return res.data;
    } catch (error) {
        console.error("Get all buses error:", error);
        throw error;
    }
};

export const getBusesByStatus = async (status) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-buses-by-status`, {
            params: { status },
        });
        return res.data;
    } catch (error) {
        console.error("Get buses by status error:", error);
        throw error;
    }
};

export const getBusesByBusId = async (busId) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-buses-by-busId`, {
            params: { busId },
        });
        return res.data;
    } catch (error) {
        console.error("Get buses by busId error:", error);
        throw error;
    }
};

export const getBusesByBusNumber = async (busNumber) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-buses-by-bus-number`, {
            params: { busNumber },
        });
        return res.data;
    } catch (error) {
        console.error("Get buses by busNumber error:", error);
        throw error;
    }
};

export const getBusesByRouteNumber = async (routeNumber) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-buses-by-route-number`, {
            params: { routeNumber },
        });
        return res.data;
    } catch (error) {
        console.error("Get buses by routeNumber error:", error);
        throw error;
    }
};

export const updateBus = async (data) => {
    try {
        const res = await axios.put(`${BASE_URL}/update-bus`, data);
        return res.data;
    } catch (error) {
        console.error("Update bus error:", error);
        throw error;
    }
};
