import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusList.module.scss";
import { useNavigate } from "react-router-dom";
import * as BusService from "../../../service/BusService";

const cx = classNames.bind(styles);

const List = ({ bus, setBusDetail, busDetail }) => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await BusService.getAll();
        console.log(response?.data);

        setBuses(response?.data || []);
      } catch (error) {
        console.error("Fetch buses error:", error);
      }
    };
    fetchBuses();
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
