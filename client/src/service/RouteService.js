import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL_ROUTE;

//  ROUTE API
export const getAllRoutes = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/get-all-routes`);
        return res.data;
    } catch (error) {
        console.error("Get all routes error:", error);
        throw error;
    }
};

export const getRouteByRouteNumber = async (routeNumber) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-route-by-route-number`, {
            params: { routeNumber },
        });
        return res.data;
    } catch (error) {
        console.error("Get route by number error:", error);
        throw error;
    }
};

export const updateRoute = async (data) => {
    try {
        const res = await axios.put(`${BASE_URL}/update-route`, data);
        return res.data;
    } catch (error) {
        console.error("Update route error:", error);
        throw error;
    }
};

//  STATION DATA
export const busStationsWithCoordinates = [
    {
        name: "Bến xe Miền Đông",
        address: "292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM",
        lat: 10.801143,
        lon: 106.712271,
    },
    {
        name: "Bến xe Miền Tây",
        address: "395 Kinh Dương Vương, Bình Tân, TP.HCM",
        lat: 10.745011,
        lon: 106.635742,
    },
    {
        name: "Chợ Bến Thành",
        address: "Lê Lợi, Quận 1, TP.HCM",
        lat: 10.772035,
        lon: 106.698063,
    },
    {
        name: "Công viên 23/9",
        address: "Phạm Ngũ Lão, Quận 1, TP.HCM",
        lat: 10.767537,
        lon: 106.692845,
    },
    {
        name: "Công viên Tao Đàn",
        address: "Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
        lat: 10.776492,
        lon: 106.690992,
    },
    {
        name: "Bến Thành – Suối Tiên",
        address: "Xa Lộ Hà Nội, Thủ Đức, TP.HCM",
        lat: 10.870395,
        lon: 106.803459,
    },
    {
        name: "Ngã tư An Sương",
        address: "QL22, Hóc Môn, TP.HCM",
        lat: 10.856153,
        lon: 106.611909,
    },
    {
        name: "Bến xe Chợ Lớn",
        address: "Trần Hưng Đạo B, Quận 5, TP.HCM",
        lat: 10.752725,
        lon: 106.662516,
    },
    {
        name: "Bến xe Củ Chi",
        address: "QL22, Thị trấn Củ Chi, TP.HCM",
        lat: 11.006036,
        lon: 106.495762,
    },
    {
        name: "Bến xe An Sương",
        address: "QL22, Quận 12, TP.HCM",
        lat: 10.855824,
        lon: 106.613552,
    },
    {
        name: "Bến xe Gò Vấp",
        address: "Quang Trung, Gò Vấp, TP.HCM",
        lat: 10.834733,
        lon: 106.662329,
    },
    {
        name: "Bến xe Thủ Đức",
        address: "QL13, Thủ Đức, TP.HCM",
        lat: 10.861045,
        lon: 106.752437,
    },
    {
        name: "Bến xe Tân Phú",
        address: "Trường Chinh, Tân Phú, TP.HCM",
        lat: 10.801884,
        lon: 106.622473,
    },
    {
        name: "Công viên Hoàng Văn Thụ",
        address: "Phan Đình Giót, Tân Bình, TP.HCM",
        lat: 10.801247,
        lon: 106.659432,
    },
    {
        name: "Khu đô thị Phú Mỹ Hưng",
        address: "Nguyễn Văn Linh, Quận 7, TP.HCM",
        lat: 10.730893,
        lon: 106.72166,
    },
];
