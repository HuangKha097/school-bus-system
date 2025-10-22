import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/BusDetail.module.scss";

import StudentList from "../../manager/Student/StudentList.jsx";
import Filter from "../../../components/Filter.jsx";
import * as BusService from "../../../service/BusService.js";
import * as RouteService from "../../../service/RouteService.js";
import * as UserService from "../../../service/UserService.js";
import toast, { Toaster } from "react-hot-toast";

const cx = classNames.bind(styles);

const BusDetail = ({ busDetail, setBusDetail }) => {
    // ---------- Search state ----------
    const [searchValue, setSearchValue] = useState("");

    //    [{ parent, childName }, ...]
    const [studentsSelected, setStudentsSelected] = useState([]);
    console.log("====================================");
    console.log(studentsSelected);
    console.log("====================================");
    // ---------- Others state ----------
    const [drivers, setDriver] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [busUpdate, setBusUpdate] = useState(busDetail);
    const [showListStudent, setShowListStudent] = useState(false);
    const [routeName, setRouteName] = useState("");
    const [studentPopUp, setStudentPopUp] = useState([]);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await UserService.getUserByRole("driver");
                setDriver(res?.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDrivers();
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
            const res = await BusService.updateBus(busUpdate);
            if (!res?.success) {
                toast.error(res?.message || "Cập nhật thất bại");
                return;
            }
            setBusDetail(res.data);
            setIsEditing(false);

            // Cập nhật cho tài xế
            const driverId = busUpdate.driver;

            if (driverId) {
                const driver = await UserService.getUserByUserId(driverId);

                const currentAssigned = driver.assignedBus || [];

                const updatedAssigned = currentAssigned.includes(busUpdate._id)
                    ? currentAssigned
                    : [...currentAssigned, busUpdate._id];

                await UserService.updateDriverInfo(driverId, {
                    assignedBus: updatedAssigned,
                });
            }
            // PHỤ HUYNH
            const allParentsRes = await UserService.getUserByRole("parent");
            const allParentsData = allParentsRes?.data || [];

            const studentsToUpdateByParent = {};
            for (const student of studentsSelected) {
                if (student.parentPhone) {
                    if (!studentsToUpdateByParent[student.parentPhone]) {
                        studentsToUpdateByParent[student.parentPhone] = [];
                    }

                    studentsToUpdateByParent[student.parentPhone].push(
                        student.studentNumber
                    );
                }
            }

            const updatePromises = [];

            for (const phone in studentsToUpdateByParent) {
                const currentParent = allParentsData.find(
                    (p) => p.phone === phone
                );
                if (
                    !currentParent ||
                    !currentParent.parentInfo ||
                    !currentParent.parentInfo.children
                ) {
                    console.warn(`Không tìm thấy data cho phụ huynh: ${phone}`);
                    continue;
                }

                // Lấy danh sách studentNumber cần cập nhật cho phụ huynh NÀY
                const studentNumbersToUpdate = studentsToUpdateByParent[phone];

                const updatedChildren = currentParent.parentInfo.children.map(
                    (child) => {
                        // Kiểm tra xem 'child' này có nằm trong danh sách cần update không
                        if (
                            studentNumbersToUpdate.includes(child.studentNumber)
                        ) {
                            return {
                                ...child,
                                registeredBus: busUpdate._id || null,
                            };
                        }

                        return child;
                    }
                );

                // them promise update vào mảng
                updatePromises.push(
                    UserService.updateStudent({
                        parentPhone: phone,
                        parentInfo: {
                            ...currentParent.parentInfo,
                            children: updatedChildren,
                        },
                    })
                );
            }

            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
            }

            toast.success("Cập nhật xe bus và thông tin học sinh thành công");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật");
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
            const res = await UserService.findStudentsByGrade(searchValue);
            if (res?.success && res?.students) {
                setStudentPopUp(res?.students);
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
                    <button
                        className={cx("editBtn")}
                        onClick={handleOpenStudentPopup}
                    >
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
                                if (
                                    window.confirm(
                                        "Bạn có chắc muốn reset bus này không?"
                                    )
                                ) {
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
                    <button
                        className={cx("editBtn")}
                        onClick={() => setIsEditing(true)}
                    >
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
                            <Filter
                                firstTitle={"By class"}
                                ActiveFirstTitle={true}
                            />
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
