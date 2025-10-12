import React from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleList.module.scss";
import { useEffect } from "react";
import { useState } from "react";
import * as RouteService from "../../../service/RouteService.js";

const cx = classNames.bind(styles);
const RouteList = ({ setRouteDetail }) => {
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await RouteService.getAllRoutes();
        console.log(res?.result);
        setRoutes(res?.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <table className={cx("table")}>
      <thead>
        <tr>
          <th>Route ID</th>
          <th>Name</th>
          <th>Bus Number</th>
          <th>Driver</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {routes && routes.length > 0 ? (
          routes.map((route) => (
            <tr
              key={route._id}
              onClick={() => setRouteDetail(route)}
              className={cx("row")}
            >
              <td>{route.routeNumber}</td>
              <td>{route.name}</td>
              <td>{route.busNumber}</td>
              <td>{route.driverName}</td>
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
