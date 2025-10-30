import React from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleList.module.scss";
import { useEffect } from "react";
import { useState } from "react";

import * as RouteController from "../../../controller/RouteController.js";

const cx = classNames.bind(styles);
const RouteList = ({ routeDetail, setRouteDetail }) => {
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await RouteController.fetchAllRoutes();
                setRoutes(response);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [routeDetail]);

    return (
        <table className={cx("table")}>
            <thead>
                <tr>
                    <th>Route ID</th>
                    <th>Name</th>
                    <th>Bus Number</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {routes && routes.length > 0 ? (
                    routes.map((route) => (
                        <tr
                            key={route._id}
                            onClick={() => setRouteDetail({ ...route })}
                            className={cx("row")}
                        >
                            <td>{route.routeNumber}</td>
                            <td>{route.name}</td>
                            <td>
                                {" "}
                                {route.buses && route.buses.length > 0
                                    ? route.buses
                                          .map((bus) => bus.busNumber)
                                          .join(", ")
                                    : "Không có xe"}
                            </td>

                            <td>{route.time}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No routes available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default RouteList;
