import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";

import MyScheduleTab from "../components/driver/MyScheduleTab";
import DriverTrackingWrapper from "../components/driver/DriverTrackingWrapper";
import StudentListTab from "../components/driver/StudentListTab";
import ReportTab from "../components/driver/ReportTab";
import NotificationTab from "../components/driver/NotificationTab";

import * as RouteController from "../controller/RouteController.js";
import * as BusController from "../controller/BusController.js";
import * as UserController from "../controller/UserController.js";
const cx = classNames.bind(styles);

const DriverPage = ({ role, setRole, userName, userId }) => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState({});
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);

    //   Lấy thông tin tài xế
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await UserController.fetchUserById(userId);
                console.log(result);

                setUser(result);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, [userId]);

    //  Lấy danh sách bus của tài xế

    useEffect(() => {
        (async () => {
            try {
                const response = await BusController.fetchDriverBus(
                    user?.driverInfo?.assignedBus
                );

                setBuses(response);
            } catch (err) {
                console.error("Error fetching buses:", err);
            }
        })();
    }, [user]);

    //   Lấy route cho từng bus
    useEffect(() => {
        const fetchRoutes = async () => {
            if (!buses?.length) return;

            const routeMap = {};

            for (const bus of buses) {
                if (!bus.routeNumber) continue;
                try {
                    const response = await RouteController.fetchRouteNumber(
                        bus.routeNumber
                    );
                    const routeData = Array.isArray(response)
                        ? response[0]
                        : response;
                    routeMap[bus.routeNumber] = routeData;
                } catch (err) {
                    console.error(
                        `Error fetching route for ${bus.routeNumber}:`,
                        err
                    );
                }
            }

            setRoutes(routeMap);
        };

        fetchRoutes();
    }, [buses]);

    //  Lấy danh sách học sinh cho bus đang chạy
    useEffect(() => {
        const fetchStudents = async () => {
            const activeBus = buses?.find((b) => b.busStatus === "Đang chạy");
            if (!activeBus?.students?.length) {
                setStudents([]);
                return;
            }

            try {
                const studentIds = activeBus.students;
                const resParents = await UserController.fetchUserByRole(
                    "parent"
                );
                const parents = resParents || [];

                const studentData = studentIds
                    .map((student) => {
                        const parent = parents.find((p) =>
                            p.parentInfo?.children?.some(
                                (child) =>
                                    String(child._id) === String(student._id)
                            )
                        );
                        if (!parent) return null;

                        const foundStudent = parent.parentInfo.children.find(
                            (child) => String(child._id) === String(student._id)
                        );

                        return {
                            ...foundStudent,
                            parentName: parent.fullName,
                            parentPhone: parent.phone,
                            parentId: parent._id,
                        };
                    })
                    .filter(Boolean);

                setStudents(studentData);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, [buses]);

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <div className={cx("left-block")}>
                    <NavBar role={role} setRole={setRole} userName={userName} />
                </div>

                <div className={cx("right-block")}>
                    <Routes>
                        <Route
                            path="/myschedule"
                            element={
                                <MyScheduleTab buses={buses} routes={routes} />
                            }
                        />

                        <Route
                            path="/tracking"
                            element={
                                <span>
                                    Chọn một xe bus trong Schedule để xem bản đồ
                                    theo dõi.
                                </span>
                            }
                        />

                        <Route
                            path="/tracking/:id"
                            element={<DriverTrackingWrapper />}
                        />

                        <Route
                            path="/students-list"
                            element={
                                Object.keys(routes).length ? (
                                    <StudentListTab
                                        students={students}
                                        route={
                                            routes[
                                                buses.find(
                                                    (b) =>
                                                        b.busStatus ===
                                                        "Đang chạy"
                                                )?.routeNumber
                                            ]
                                        } //  lấy route tương ứng bus đang chạy
                                        buses={buses}
                                    />
                                ) : (
                                    <div className={cx("loading-text")}>
                                        Đang tải thông tin tuyến xe...
                                    </div>
                                )
                            }
                        />

                        <Route
                            path="/notification"
                            element={<NotificationTab user={user} />}
                        />
                        <Route
                            path="/report"
                            element={<ReportTab buses={buses} />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default DriverPage;
