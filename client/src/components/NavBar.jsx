import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/NavBar.module.scss";
import avatar from "../assets/avatar_icon.png";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
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
                    {role === "manager" && (
                        <>
                            <NavLink
                                to={"/bus"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Buses
                            </NavLink>
                            <NavLink
                                to={"/driver"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Drivers
                            </NavLink>
                            <NavLink
                                to={"/student"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Students
                            </NavLink>
                            <NavLink
                                to={"/schedule"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Routes & Schedule
                            </NavLink>
                            <NavLink
                                to={"/tracking"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Live Tracking
                            </NavLink>
                            <NavLink
                                to={"/message"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Messages
                            </NavLink>
                            <NavLink
                                to={"/setting"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                Settings
                            </NavLink>
                        </>
                    )}

                    {role === "driver" && (
                        <>
                            <NavLink
                                to={"/myschedule"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>My Schedule</li>
                            </NavLink>
                            <NavLink
                                to={"/tracking"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>Live Tracking</li>
                            </NavLink>
                            <NavLink
                                to={"/students-list"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>Students List</li>
                            </NavLink>
                            <NavLink
                                to={"/notification"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>Notifications</li>
                            </NavLink>
                            <NavLink
                                to={"/report"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>Report Incident</li>
                            </NavLink>
                        </>
                    )}

                    {role === "parent" && (
                        <>
                            <NavLink
                                to={"/dashboard"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>Dashboard</li>
                            </NavLink>

                            <NavLink
                                to={"/notifications"}
                                className={({ isActive }) =>
                                    cx("menu-item", { active: isActive })
                                }
                            >
                                <li>Notifications</li>
                            </NavLink>
                        </>
                    )}
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
