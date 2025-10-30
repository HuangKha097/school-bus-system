import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/DriverList.module.scss";

import * as UserController from "../../../controller/UserController";

const cx = classNames.bind(styles);

const DriverList = ({ setDriverDetail, driverDetail, driver }) => {
    const [drivers, setDrivers] = useState([]);

    console.log(drivers);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const drivers = await UserController.fetchUserByRole("driver");
                setDrivers(drivers);
            } catch (error) {
                console.error("Fetch drivers error:", error);
            }
        };
        fetchDrivers();
    }, [driverDetail]);

    const displayDriver = driver ? driver : drivers;

    return (
        <table className={cx("table")}>
            <thead>
                <tr>
                    <th>Driver ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {displayDriver.map((item, index) => (
                    <tr
                        key={index}
                        onClick={() =>
                            setDriverDetail({
                                _id: item?._id,
                                driverNumber: item?.driverInfo?.driverNumber,
                                fullName: item?.fullName,
                                phone: item?.phone,
                                licenseNumber: item?.driverInfo?.licenseNumber,
                                licenseClass: item?.driverInfo?.licenseClass,
                                assignedBus:
                                    item?.driverInfo?.assignedBus?.map(
                                        (bus) => bus.busNumber
                                    ) || [],

                                status: item?.driverInfo?.status,
                            })
                        }
                    >
                        <td>{item?.driverInfo?.driverNumber}</td>
                        <td>{item?.fullName}</td>
                        <td>{item?.phone}</td>
                        <td>
                            <span
                                className={cx(
                                    "status",
                                    item?.driverInfo?.status ===
                                        "Đang hoạt động"
                                        ? "active"
                                        : item?.driverInfo?.status ===
                                          "Nghỉ phép"
                                        ? "leave"
                                        : "inactive"
                                )}
                            >
                                {item?.driverInfo?.status || "Chưa cập nhật"}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DriverList;
