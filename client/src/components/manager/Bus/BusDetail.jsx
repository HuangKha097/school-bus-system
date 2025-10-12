import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusDetail.module.scss";
import * as BusService from "../../../service/BusService";
import * as RouteService from "../../../service/RouteService";
import * as UserService from "../../../service/UserService";
import toast, { Toaster } from "react-hot-toast";
const cx = classNames.bind(styles);

const BusDetail = ({ busDetail, setBusDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [busUpdate, setBusUpdate] = useState(busDetail);
  const [drivers, setDriver] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await UserService.getUserByRole("driver");
        setDriver(res?.data);
        console.log(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusUpdate({ ...busUpdate, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await BusService.updateBus(busUpdate);
      if (res?.success) {
        setBusDetail(res.data);
        setBusUpdate(res.data);
        setIsEditing(false);

        toast.success("Cập nhật xe bus thành công ");
      } else {
        toast.error(res?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật ");
    }
  };

  // Khi prop busDetail thay đổi (ví dụ khi chọn bus khác) , đồng bộ vào state
  useEffect(() => {
    setBusUpdate(busDetail);
  }, [busDetail]);
  console.log("Sending update:", busUpdate);

  return (
    <div className={cx("busDetailWrapper")}>
      <h4>Bus Detail</h4>

      <div className={cx("row")}>
        <span className={cx("label")}>Bus ID:</span>
        <span className={cx("value")}>{busDetail.busNumber}</span>
      </div>
      <div className={cx("row")}>
        <span className={cx("label")}>License Plate:</span>
        <span className={cx("value")}>{busDetail.licensePlate}</span>
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Capacity:</span>
        <span className={cx("value")}>{busDetail.capacity}</span>
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Current Students:</span>
        <span className={cx("value")}>{busDetail.student}</span>
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Last Update:</span>
        <span className={cx("value")}>{busDetail.lastUpdate}</span>
      </div>

      {/* Các field có thể edit */}
      <div className={cx("row")}>
        <span className={cx("label")}>Driver:</span>
        {isEditing ? (
          <select
            type="text"
            name="driver"
            value={busUpdate.driver || ""}
            onChange={handleChange}
          >
            {drivers.map((item, index) => {
              return (
                <option key={index} value={item.email}>
                  {item.fullName || item.driver?.fullName}
                </option>
              );
            })}
          </select>
        ) : (
          <span className={cx("value")}>
            {busDetail.driver?.fullName || "Chưa có"}
          </span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Route:</span>
        {isEditing ? (
          <select
            name="route"
            value={busUpdate.route || ""}
            onChange={handleChange}
          >
            <option value="">-- Chọn tuyến xe buýt --</option>
            {RouteService.busStationsWithCoordinates.map((station, idx) => (
              <option key={idx} value={`${station.name}, ${station.address}`}>
                {station.name} - {station.address}
              </option>
            ))}
          </select>
        ) : (
          <span className={cx("value")}>
            {busDetail.routeNumber || "Chưa có"}
          </span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Status:</span>
        {isEditing ? (
          <select
            name="busStatus"
            value={busUpdate.busStatus || ""}
            onChange={handleChange}
          >
            <option value="Đang chạy">Đang chạy</option>
            <option value="Dừng">Dừng</option>
            <option value="Bảo trì">Bảo trì</option>
          </select>
        ) : (
          <span className={cx("value")}>{busDetail.busStatus}</span>
        )}
      </div>

      {/* Nút hành động */}
      <div className={cx("btnGroup")}>
        {isEditing ? (
          <>
            <button
              className={cx("cancelBtn")}
              onClick={() => {
                setBusUpdate(busDetail);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            <button className={cx("saveBtn")} onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <button className={cx("editBtn")} onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default BusDetail;
