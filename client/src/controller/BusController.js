import * as BusService from "../service/BusService.js";

export const fetchAllBuses = async () => {
    try {
        const response = await BusService.getAll();
        return response?.data;
    } catch (error) {
        return error;
    }
};

export const fetchBusesByStatus = async (status) => {
    try {
        const res = await BusService.getBusesByStatus(status);
        if (res?.success) return res?.data;
    } catch (error) {
        return error;
    }
};

export const fetchDriverBus = async (assignedBus) => {
    if (!assignedBus?.length) return;
    try {
        const busRefs = assignedBus;

        const results = await Promise.all(
            busRefs.map((busRef) => BusService.getBusesByBusId(busRef.busId))
        );

        const fetchedBuses = results.map((res) =>
            Array.isArray(res.data) ? res.data[0] : res.data
        );

        return fetchedBuses;
    } catch (error) {
        return error;
    }
};

export const fetchBusById = async (busId) => {
    if (!busId) return;
    try {
        const result = await BusService.getBusesByBusId(busId);
        const busData = result?.data?.[0];
        return busData;
    } catch (error) {
        return error;
    }
};

export const searchBus = async (ActiveSecondTitle, valueSearch) => {
    if (!valueSearch.trim()) {
        return null;
    }
    try {
        let res;
        ActiveSecondTitle
            ? (res = await BusService.getBusesByRouteNumber(valueSearch))
            : (res = await BusService.getBusesByBusNumber(valueSearch));
        if (res?.success) return res?.data;
    } catch (error) {
        return error;
    }
};
export const updateBus = async (data) => {
    try {
        const response = await BusService.updateBus(data);
        return response;
    } catch (error) {
        return error;
    }
};
