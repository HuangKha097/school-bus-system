import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusList.module.scss";

import * as BusController from "../../../controller/BusController";

const cx = classNames.bind(styles);

const List = ({ bus, setBusDetail, busDetail }) => {
    const [buses, setBuses] = useState([]);

    //IIFE ( Immediately Invoked Function Expression)
    useEffect(() => {
        (async () => {
            const response = await BusController.fetchAllBuses();
            setBuses(response || []);
        })();
    }, [busDetail]);

    const displayBuses = bus ? [bus] : buses;

    return (
        <table className={cx("table")}>
            <thead>
                <tr>
                    <th>Bus ID</th>
                    <th>Driver</th>
                    <th>Route</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {displayBuses.map((item, index) => (
                    <tr
                        key={index}
                        onClick={() =>
                            setBusDetail({
                                _id: item._id,
                                busNumber: item.busNumber,
                                driver: item.driver,
                                licensePlate: item.licensePlate,
                                routeNumber: item.routeNumber,
                                busStatus: item.busStatus,
                                capacity: item.capacity || 0,
                                currentStudents: item.student || 0,
                                lastUpdate: "",
                                students: item.students || [],
                            })
                        }
                    >
                        <td>{item.busNumber}</td>
                        <td>{item?.driver?.fullName || "Chưa có"}</td>
                        <td>{item.name || item.routeNumber || "Chưa có"}</td>

                        <td>
                            <span
                                className={cx(
                                    "status",
                                    item.busStatus === "Đang chạy"
                                        ? "running"
                                        : item.busStatus === "Bảo trì"
                                        ? "maintenance"
                                        : "stopped"
                                )}
                            >
                                {item.busStatus}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default List;
