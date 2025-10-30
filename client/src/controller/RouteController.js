import * as RouteService from "../service/RouteService.js";

export const fetchAllRoutes = async () => {
    try {
        const res = await RouteService.getAllRoutes();
        if (res?.success) return res?.result;
    } catch (error) {
        return error;
    }
};

export const fetchRouteNumber = async (routeName) => {
    try {
        if (!routeName) return;
        const res = await RouteService.getRouteByRouteNumber(routeName);
        if (res?.success) return res?.data;
    } catch (error) {
        return error;
    }
};
export const updateRoute = async (updatePayload) => {
    try {
        const res = await RouteService.updateRoute(updatePayload);
        if (res?.success) return res;
    } catch (error) {
        return error;
    }
};
