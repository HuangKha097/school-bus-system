import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import NavBar from "../components/NavBar";

import NotificationTab from "../components/parent/NotificationTab";
import DashboardTab from "../components/parent/DashBoardTab";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tracking from "../components/Tracking";
import * as UserService from "../service/UserService.js";

const cx = classNames.bind(styles);

const ParentPage = ({ role, setRole, userName, userId }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await UserService.getUserByUserId(userId);
                console.log("====================================");
                console.log(result?.data?.[0]);
                setUser(result?.data?.[0]);
                console.log("====================================");
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);

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

                    {/* Nội dung hiển thị */}
                    <div className={cx("right-block")}>
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={<DashboardTab user={user} />}
                            />
                            <Route path="/tracking" element={<Tracking />} />
                            <Route
                                path="/notifications"
                                element={<NotificationTab user={user} />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentPage;
