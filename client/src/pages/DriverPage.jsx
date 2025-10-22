import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    const [route, setRoute] = useState([]);
    const [user, setUser] = useState({});
    const [students, setStudents] = useState([]);
    console.log(route);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await UserService.getUserByUserId(userId);
                console.log(result?.data);

                setUser(result?.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const busId = user?.[0]?.driverInfo?.assignedBus;
                const result = await BusService.getBusesByBusId(busId);
                setBuses(result?.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBus();
    }, [user]);
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const routeNumber = buses?.[0]?.routeNumber;
                const result = await RouteService.getRouteByRouteNumber(
                    routeNumber
                );
                setRoute(result?.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRoute();
    }, [buses]);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsIdList = buses?.[0]?.students || [];
                if (!studentsIdList.length) return;

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

                console.log("Fetched students:", studentData);
                setStudents(studentData);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, [buses]);

    console.log("====================================");
    console.log("students: ", students);
    console.log("====================================");
    return (
        <div>
            <div className={cx("container")}>
                <div className={cx("content")}>
                    <div className={cx("left-block")}>
                        <NavBar
                            role={role}
                            setRole={setRole}
                            userName={userName}
                        />
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
                                path="/tracking/:id"
                                element={<DriverTrackingWrapper />}
                            />
                            <Route
                                path="/students-list"
                                element={
                                    <StudentListTab
                                        students={students}
                                        route={route}
                                    />
                                }
                            />
                            <Route path="/report" element={<ReportTab />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverPage;
