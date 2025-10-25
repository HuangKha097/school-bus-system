import React from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusList.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import * as BusService from "../../../service/BusService.js";
import * as RouteService from "../../../service/RouteService.js";

const cx = classNames.bind(styles);

const List = ({ endAddress, setEndAddress }) => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [routeCoords, setRouteCoords] = useState({ lat: null, lng: null });
  console.log(routeCoords);

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
  console.log(buses);
  const fetchRouteName = async (value) => {
    try {
      const res = await RouteService.getRouteByRouteNumber(value);
      const data = res?.data;

      console.log(data);

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
                fetchRouteName(item?.routeNumber);
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
