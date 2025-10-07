import React from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleList.module.scss";
const cx = classNames.bind(styles);

const RouteList = ({ routes, setRouteDetail }) => {
  return (
    <table className={cx("table")}>
      <thead>
        <tr>
          <th>Route ID</th>
          <th>Bus Number</th>
          <th>Driver</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {routes && routes.length > 0 ? (
          routes.map((route) => (
            <tr
              key={route.routeId}
              onClick={() => setRouteDetail(route)}
              className={cx("row")}
            >
              <td>{route.routeId}</td>
              <td>{route.busNumber}</td>
              <td>{route.driverName}</td>
              <td>
                {route.startTime} - {route.endTime}
              </td>
              <td>
                <span className={cx("status", "active")}>{route.status}</span>
              </td>
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
