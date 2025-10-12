import React from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusList.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import * as BusService from "../../../service/BusService.js";

const cx = classNames.bind(styles);

const List = ({ endAddress, setEndAddress }) => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await BusService.getBusesByStatus("Đang chạy");
        setBuses(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBuses();
  }, []);
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
        {buses.map((item, number) => (
          <tr
            key={item.busNumber}
            onClick={() => {
              navigate(`/tracking/${item.busNumber}`);
              setEndAddress(item.route);
            }}
          >
            <td>{item.busNumber}</td>
            <td>{item.driver || item.driver?.fullName || "Chưa có"}</td>
            <td>{item.route || item.driver?.fullName || "Chưa có"}</td>
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
        ))}
      </tbody>
    </table>
  );
};

export default List;
