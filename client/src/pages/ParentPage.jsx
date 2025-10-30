import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import NavBar from "../components/NavBar";

import NotificationTab from "../components/parent/NotificationTab";
import DashboardTab from "../components/parent/DashBoardTab";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ParentTrackingWrapper from "../components/parent/ParentTrackingWrapper";
import * as UserService from "../service/UserService.js";

const cx = classNames.bind(styles);

const ParentPage = ({ role, setRole, userName, userId }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await UserService.getUserById(userId);

                console.log(result?.data?.[0]);
                setUser(result?.data?.[0]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, [userId]);

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
                                path="/dashboard"
                                element={<DashboardTab user={user} />}
                            />

                            <Route
                                path="/tracking/:id"
                                element={<ParentTrackingWrapper />}
                            />
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
