import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";

import MyScheduleTab from "../components/driver/MyScheduleTab";
import DriverTrackingWrapper from "../components/driver/DriverTrackingWrapper";
import StudentListTab from "../components/driver/StudentListTab";
import ReportTab from "../components/driver/ReportTab";

import * as BusService from "../service/BusService.js";
import * as UserService from "../service/UserService.js";
import * as RouteService from "../service/RouteService.js";

const cx = classNames.bind(styles);

const DriverPage = ({ role, setRole, userName, userId }) => {
    const [buses, setBuses] = useState([]);
    const [route, setRoute] = useState(null);
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);

    //   Lấy thông tin tài xế
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await UserService.getUserByUserId(userId);
                const userData = Array.isArray(result?.data)
                    ? result.data[0]
                    : result.data;
                console.log(">>> USER:", userData);
                setUser(userData);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, [userId]);

    //   Lấy bus của tài xế
    useEffect(() => {
        const fetchBus = async () => {
            if (!user?.driverInfo?.assignedBus?.length) return;
            try {
                const busIds = user.driverInfo.assignedBus;
                const results = await Promise.all(
                    busIds.map((id) => BusService.getBusesByBusId(id))
                );
                const fetchedBuses = results.map((res) =>
                    Array.isArray(res.data) ? res.data[0] : res.data
                );
                console.log(">>> BUSES:", fetchedBuses);
                setBuses(fetchedBuses);
            } catch (err) {
                console.error("Error fetching buses:", err);
            }
        };
        fetchBus();
    }, [user]);

    //   Lấy route
    useEffect(() => {
        const fetchRoute = async () => {
            if (!buses?.length) return;
            const routeNumber = buses[0]?.routeNumber;
            if (!routeNumber) return;
            try {
                const result = await RouteService.getRouteByRouteNumber(
                    routeNumber
                );
                const routeData = Array.isArray(result?.data)
                    ? result.data[0]
                    : result.data;
                console.log(">>> ROUTE DATA:", routeData);
                setRoute(routeData);
            } catch (err) {
                console.error("Error fetching route:", err);
            }
        };
        fetchRoute();
    }, [buses]);

    //  Lấy danh sách học sinh
    useEffect(() => {
        const fetchStudents = async () => {
            if (!buses?.[0]?.students?.length) {
                setStudents([]);
                return;
            }

            try {
                const studentsIdList = buses[0].students;

                const studentPromises = studentsIdList.map(async (student) => {
                    const res = await UserService.getStudentById(student._id);
                    const parent = res?.data?.[0];
                    const foundStudent = parent?.parentInfo?.children?.find(
                        (child) => child._id === student._id
                    );
                    return foundStudent || null;
                });

                const studentData = (await Promise.all(studentPromises)).filter(
                    Boolean
                );
                console.log(">>> STUDENTS:", studentData);
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
                                <MyScheduleTab
                                    buses={buses}
                                    route={route}
                                    user={user}
                                />
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
                                route ? (
                                    <StudentListTab
                                        students={students}
                                        route={route}
                                    />
                                ) : (
                                    <div className={cx("loading-text")}>
                                        Đang tải thông tin tuyến xe...
                                    </div>
                                )
                            }
                        />

                        <Route path="/report" element={<ReportTab />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default DriverPage;
