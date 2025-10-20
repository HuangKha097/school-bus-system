import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/NavBar.module.scss";
import avatar from "../assets/avatar_icon.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);
const NavBar = ({ role, setRole, userName }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setRole("");
        navigate("/login", { replace: true });
    };
    return (
        <div className={cx("menu-wrapper")}>
            <div className={cx("header")}>
                <div className={cx("user-info")}>
                    <img src={avatar} alt="" className={cx("user-avatar")} />
                    <div className={cx("info")}>
                        <span className={cx("userName")}>{userName}</span>
                        <span className={cx("role")}>{role}</span>
                    </div>
                </div>
                <ul className={cx("menu")}>
                    <ul className={cx("menu")}>
                        {role === "manager" && (
                            <>
                                <Link to={"/bus"}>
                                    <li>Buses</li>
                                </Link>
                                <Link to={"/driver"}>
                                    <li>Drivers</li>
                                </Link>
                                <Link to={"/student"}>
                                    <li>Students</li>
                                </Link>
                                <Link to={"/schedule"}>
                                    <li>Routes & Schedule</li>
                                </Link>
                                <Link to={"/tracking"}>
                                    <li>Live Tracking</li>
                                </Link>
                                <Link to={"/message"}>
                                    <li>Messages</li>
                                </Link>
                                <Link to={"/setting"}>
                                    <li>Settings</li>
                                </Link>
                            </>
                        )}

                        {role === "driver" && (
                            <>
                                <Link to={"/myschedule"}>
                                    <li>My Schedule</li>
                                </Link>
                                <Link to={"/tracking"}>
                                    <li>Live Tracking</li>
                                </Link>
                                <Link to={"/students-list"}>
                                    <li>Students List</li>
                                </Link>
                                <Link to={"/report"}>
                                    <li>Report Incident</li>
                                </Link>
                            </>
                        )}

                        {role === "parent" && (
                            <>
                                <Link to={"/dashboard"}>
                                    <li>Dashboard</li>
                                </Link>
                                <Link to={"/tracking"}>
                                    <li>Live Tracking</li>
                                </Link>
                                <Link to={"/notifications"}>
                                    <li>Notifications</li>
                                </Link>
                            </>
                        )}
                    </ul>
                </ul>
            </div>
            <div className={cx("footer")}>
                <span>@bygroup2</span>
                <span className={cx("log-out")} onClick={handleLogout}>
                    Logout
                </span>
            </div>
        </div>
    );
};

export default NavBar;
