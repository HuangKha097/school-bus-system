import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusDetail.module.scss";
import StudentList from "../../manager/Student/StudentList.jsx";
import * as BusService from "../../../service/BusService.js";
import * as RouteService from "../../../service/RouteService.js";
import * as UserService from "../../../service/UserService.js";
import toast, { Toaster } from "react-hot-toast";
const cx = classNames.bind(styles);

const BusDetail = ({ busDetail, setBusDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [busUpdate, setBusUpdate] = useState(busDetail);
  const [drivers, setDriver] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [showListStudent, setShowListStudent] = useState(false);
  const [byClass, setByClass] = useState(false);
  const [isActive, setIsActive] = useState(false);

  console.log(routeName);
  console.log("Bus update: ", busUpdate);
  console.log("Bus detail: ", busDetail);

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
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await RouteService.getAllRoutes();
        setRoutes(res?.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoute();
  }, []);

  useEffect(() => {
    const fetchRouteName = async () => {
      try {
        if (!busDetail?.routeNumber) return;
        const res = await RouteService.getRouteByRouteNumber(
          busDetail.routeNumber
        );

        setRouteName(res?.data?.name || "Không có tên tuyến");
      } catch (error) {
        console.log(error);
      }
    };

    fetchRouteName();
  }, [busDetail?.routeNumber]);

  const handleSave = async () => {
    try {
      const res = await BusService.updateBus(busUpdate);
      console.log("====================================");
      console.log("Bus update:", busUpdate);
      console.log("====================================");

      if (res?.success) {
        const driverId = busUpdate.driver;
        console.log("Driver Id: ", driverId);
        console.log("Bus Update: ", busUpdate);

        await UserService.updateDriverInfo(driverId, {
          assignedBus: busUpdate._id,
        });
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
  const handleReset = async () => {
    try {
      // Dữ liệu sau khi reset
      const resetData = {
        _id: busDetail._id,
        busNumber: busDetail.busNumber,
        licensePlate: busDetail.licensePlate,
        capacity: 0,
        routeNumber: "",
        busStatus: "Dừng",
        driver: null,
        students: [],
      };

      setBusUpdate(resetData);

      const res = await BusService.updateBus(resetData);

      if (res?.success) {
        //gỡ bus khỏi route
        if (busDetail.routeNumber) {
          await RouteService.updateRoute({
            routeNumber: busDetail.routeNumber,
            buses: (busDetail.buses || [])
              .filter((bus) => bus.busNumber !== busDetail.busNumber)
              .map((bus) => bus.busNumber),
          });
        }
        // Nếu bus co tài xế cũ thi xoa liên kết
        if (busDetail.driver?._id) {
          await UserService.updateDriverInfo(busDetail.driver._id, {
            assignedBus: null,
          });
        }

        setBusDetail(res.data);
        setBusUpdate(res.data);
        setIsEditing(false);
        toast.success("Reset bus về mặc định và lưu thành công ");
      } else {
        toast.error(res?.message || "Reset thất bại ");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi reset!");
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
        {isEditing ? (
          <button
            className={cx("editBtn")}
            onClick={() => setShowListStudent(!showListStudent)}
          >
            Add student
          </button>
        ) : (
          <span className={cx("value")}>{busDetail.student}</span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Last Update:</span>
        <span className={cx("value")}>{busDetail.lastUpdate}</span>
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Driver:</span>
        {isEditing ? (
          <select
            type="text"
            name="driver"
            value={busUpdate.driver || ""}
            onChange={handleChange}
          >
            <option value="">{"-----Chon 1 tai xe-----"}</option>
            {drivers.map((item, index) => {
              return (
                <option key={index} value={item._id}>
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
        <span className={cx("value")}>{routeName || "Chưa có"}</span>
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

      <div className={cx("btnGroup")}>
        {isEditing ? (
          <>
            <button
              className={cx("resetBtn")}
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("Bạn có chắc muốn reset bus này không?")) {
                  handleReset();
                }
              }}
            >
              Reset
            </button>

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
      {showListStudent && (
        <div
          className={cx("container")}
          onClick={() => setShowListStudent(!showListStudent)}
        >
          <div
            className={cx("student-list-pop-up")}
            onClick={(e) => e.stopPropagation()}
          >
            <label htmlFor="search" className={cx("search")}>
              <input
                type="text"
                name="search"
                placeholder="Find student"
                // value={searchValue}
                // onChange={handleChange}
                // onKeyDown={handleKeyDown}
              />
              <div className={cx("filter")}>
                <span
                  className={cx("filter-tag", byClass && "active")}
                  onClick={() => setByClass(!byClass)}
                >
                  By class
                </span>

                <span
                  className={cx("filter-tag", isActive && "active")}
                  onClick={() => setIsActive(!isActive)}
                >
                  Is Active
                </span>
              </div>
            </label>
            <label htmlFor="selectAll" className={cx("selectAll")}>
              Select All
              <input
                type="checkbox"
                name="selectAll"
                placeholder="Find student"
                // value={searchValue}
                // onChange={handleChange}
                // onKeyDown={handleKeyDown}
              />
            </label>

            <StudentList showSelectCheck={true} />
            <div className={cx("btnGroup")}>
              <button className={cx("cancelBtn")}>Cancel</button>
              <button className={cx("saveBtn")}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusDetail;
