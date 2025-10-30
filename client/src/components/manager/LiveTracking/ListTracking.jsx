import React from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusList.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import * as BusController from "../../../controller/BusController";
import * as RouteController from "../../../controller/RouteController.js";

const cx = classNames.bind(styles);

const List = ({ setEndAddress }) => {
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [routeCoords, setRouteCoords] = useState({ lat: null, lng: null });
    console.log(routeCoords);

    useEffect(() => {
        (async () => {
            try {
                const response = await BusController.fetchBusesByStatus(
                    "Đang chạy"
                );
                setBuses(response);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    console.log(buses);
    const fetchRouteNumber = async (value) => {
        try {
            const response = await RouteController.fetchRouteNumber(value);
            const data = response;
            if (data) {
                const coords = {
                    lat: data.latitude,
                    lng: data.longitude,
                };
                setRouteCoords(coords);
                setEndAddress(coords);
            } else {
                console.warn("Không tìm thấy tuyến");
            }
        } catch (error) {
            console.error("Lỗi khi lấy tọa độ tuyến:", error);
        }
    };

    return (
        <table className={cx("table")}>
            <thead>
                <tr>
                    <th>Bus ID</th>
                    <th>Driver</th>
                    <th>Routes</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {buses.map((item) =>
                    item.routeNumber ? (
                        <tr
                            key={item.busNumber}
                            onClick={() => {
                                navigate(`/tracking/${item.busNumber}`);
                                fetchRouteNumber(item?.routeNumber);
                            }}
                        >
                            <td>{item.busNumber}</td>
                            <td>{item?.driver?.fullName || "Chưa có"}</td>
                            <td>{item?.routeNumber || "Chưa có"}</td>
                            <td>
                                <span
                                    className={cx(
                                        "status",
                                        item.busStatus === "Đang chạy"
                                            ? "running"
                                            : item.status === "Bảo trì"
                                            ? "maintenance"
                                            : "stopped"
                                    )}
                                >
                                    {item.busStatus}
                                </span>
                            </td>
                        </tr>
                    ) : null
                )}
            </tbody>
        </table>
    );
};

export default List;
