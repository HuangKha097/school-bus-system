import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusDetail.module.scss";

import StudentList from "../../manager/Student/StudentList.jsx";
import Filter from "../../../components/Filter.jsx";
import * as BusService from "../../../service/BusService.js";
import * as RouteService from "../../../service/RouteService.js";
import * as UserService from "../../../service/UserService.js";
import * as UserController from "../../../controller/UserController.js";

import toast, { Toaster } from "react-hot-toast";

const cx = classNames.bind(styles);

const BusDetail = ({ busDetail, setBusDetail }) => {
  //   Search state
  const [searchValue, setSearchValue] = useState("");

  //    [{ parent, childName }, ...]
  const [studentsSelected, setStudentsSelected] = useState([]);

  //   Others state
  const [drivers, setDriver] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [busUpdate, setBusUpdate] = useState(busDetail);
  const [showListStudent, setShowListStudent] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [studentPopUp, setStudentPopUp] = useState([]);

  useEffect(() => {
    const fetchDriver = async () => {
      const drivers = await UserController.fetchUserByRole("driver");
      setDriver(drivers);
    };
    fetchDriver();
  }, []);

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
  }, [busDetail]);

  const handleChangeBus = (e) => {
    const { name, value } = e.target;
    setBusUpdate({ ...busUpdate, [name]: value });
  };

  const handleSave = async () => {
    try {
      const driverId = busUpdate.driver;

      if (driverId) {
        // Lấy thông tin tài xế hiện tại
        const driver = UserController.fetchUserById(driverId);
        const currentAssignedBus = driver?.driverInfo?.assignedBus || [];

        // Tìm xe đang chạy
        const activeBus = currentAssignedBus.find(
          (bus) => bus.busStatus === "Đang chạy"
        );

        // Nếu tài xế đang chạy xe khác mà lại muốn gán xe này "Đang chạy"
        if (
          activeBus &&
          activeBus.busId.toString() !== busUpdate._id.toString() &&
          busUpdate.busStatus === "Đang chạy"
        ) {
          toast.error(
            `Tài xế hiện đang điều khiển xe ${activeBus.busNumber}. Hãy dừng xe đó trước khi gán xe mới ở trạng thái "Đang chạy".`
          );

          setIsEditing(false);
          return;
        }
      }

      //
      const res = await BusService.updateBus(busUpdate);

      if (res?.success) {
        if (driverId) {
          const driverRes = await UserService.getUserById(driverId);
          const driver = driverRes?.data?.[0];
          const currentAssignedBus = driver?.driverInfo?.assignedBus || [];

          // Kiểm tra bus đã tồn tại chưa
          const isExisting = currentAssignedBus.some(
            (bus) => String(bus.busId) === String(busUpdate._id)
          );

          let updateAssignedBus;
          if (isExisting) {
            updateAssignedBus = currentAssignedBus.map((bus) =>
              String(bus.busId) === String(busUpdate._id)
                ? {
                    ...bus,
                    busNumber: busUpdate.busNumber,
                    busStatus: busUpdate.busStatus,
                    students: busUpdate.students || [],
                  }
                : bus
            );
          } else {
            updateAssignedBus = [
              ...currentAssignedBus,
              {
                busId: busUpdate._id,
                busNumber: busUpdate.busNumber,
                busStatus: busUpdate.busStatus,
                students: busUpdate.students || [],
              },
            ];
          }

          // Gửi toàn bộ mảng sau khi merge
          UserController.updateDriver(driverId, {
            assignedBus: updateAssignedBus,
          });

          if (busUpdate.students?.length > 0) {
            for (const student of busUpdate.students) {
              try {
                await UserService.updateStudentBus(student._id, busUpdate._id);
              } catch (err) {
                console.error(
                  `Lỗi cập nhật bus cho học sinh ${student.name}:`,
                  err
                );
              }
            }
          }
        }

        setBusDetail(res.data);
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

  //  Logic handleReset
  const handleReset = async () => {
    try {
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
        if (busDetail.driver?._id) {
          UserController.updateDriver(busDetail.driver._id, {
            assignedBus: [],
          });
        }

        if (busDetail.students?.length > 0) {
          for (const student of busDetail.students) {
            try {
              await UserService.updateStudentBus(student._id, null);
            } catch (err) {
              console.error(
                `Lỗi khi xóa registeredBus của học sinh ${student.name}:`,
                err
              );
            }
          }
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      findStudents(searchValue);
    }
  };
  const handleChangeStudent = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value.trim()) {
      setStudentPopUp(null);
    }
  };

  // Logic findStudents
  const findStudents = async () => {
    try {
      if (!searchValue.trim()) {
        setStudentPopUp(null);
        return;
      }
      // "ok" vi ham can doi so ActiveFirst && logic
      const students = await UserController.findStudents("ok", searchValue);

      const filterStudents = students.filter(
        (s) => !studentsSelected.some((sel) => sel._id === s._id)
      );
      if (students) {
        const mergedStudents = [...filterStudents, ...studentsSelected];
        setStudentPopUp(mergedStudents);
      } else {
        setStudentPopUp(null);
      }
    } catch (error) {
      console.error("Search student error:", error);
    }
  };

  //  Đồng bộ prop `busDetail` vào state `busUpdate`
  useEffect(() => {
    setBusUpdate({
      ...busDetail,
      driver: busDetail.driver?._id || busDetail.driver || null,
      students: busDetail.students || [],
    });

    // Reset state khi chọn một bus khác
    setIsEditing(false);
    setShowListStudent(false);
    setStudentsSelected([]); // Reset về mảng rỗng
  }, [busDetail]);

  //   Hàm xử lý khi mở pop-up "aadd student"
  const handleOpenStudentPopup = () => {
    setStudentsSelected(busUpdate.students || []);

    setStudentPopUp([]);
    setSearchValue("");

    setShowListStudent(true);
  };

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
          <button className={cx("editBtn")} onClick={handleOpenStudentPopup}>
            Add student
          </button>
        ) : (
          <span className={cx("value")}>
            {" "}
            {busUpdate.students?.length || 0} students
          </span>
        )}
      </div>

      <div className={cx("row")}>
        <span className={cx("label")}>Driver:</span>
        {isEditing ? (
          <select
            type="text"
            name="driver"
            value={busUpdate.driver || ""}
            onChange={handleChangeBus}
          >
            <option value="">{"-----Chon 1 tai xe-----"}</option>
            {drivers.map((item, index) => (
              <option key={index} value={item._id}>
                {item.fullName || item.driver?.fullName}
              </option>
            ))}
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
            onChange={handleChangeBus}
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
                setShowListStudent(false);
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
          onClick={() => setShowListStudent(false)}
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
                value={searchValue}
                onChange={handleChangeStudent}
                onKeyDown={handleKeyDown}
              />
            </label>
            <div className={cx("filter-wrapper")}>
              <Filter firstTitle={"By class"} ActiveFirstTitle={true} />
            </div>

            <div className={cx("list-wrapper")}>
              <StudentList
                studentPopUp={studentPopUp}
                showSelectCheck={true}
                setStudentsSelected={setStudentsSelected}
                studentsSelected={studentsSelected}
              />
            </div>
            <div className={cx("btnGroup")}>
              <button
                className={cx("cancelBtn")}
                onClick={() => setShowListStudent(false)}
              >
                Cancel
              </button>
              <button
                className={cx("saveBtn")}
                onClick={() => {
                  setBusUpdate({
                    ...busUpdate,
                    students: studentsSelected,
                  });
                  setShowListStudent(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusDetail;
