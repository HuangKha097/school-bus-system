import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import DriverDetail from "../manager/Driver/DriverDetail";
import DriverList from "../manager/Driver/DriverList";
import * as UserService from "../../service/UserService";
import * as UserController from "../../controller/UserController";
import Filter from "../Filter.jsx";

const cx = classNames.bind(styles);

const DriverTab = () => {
    const [ActiveFirstTitle, setActiveFirstTitle] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    console.log(searchValue);

    const [driver, setDriver] = useState(null); // driver tìm được
    const [driverDetail, setDriverDetail] = useState({
        _id: "",
        driverNumber: "",
        fullName: "",
        phone: "",
        licenseNumber: "",
        licenseClass: "",
        status: "",
        assignedBus: "",
    });
    console.log(driverDetail);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            getUserData();
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (!value.trim()) {
            setDriver(null); // reset nếu input rỗng
        }
    };

    const getUserData = async () => {
        try {
            if (!searchValue.trim()) {
                setDriver(null); // clear => quay về list mặc định
                return;
            }
            const res = await UserController.getDriverData(
                ActiveFirstTitle,
                searchValue
            );

            if (res?.success && res?.user) {
                setDriver(res?.user);
                setDriverDetail({
                    _id: res?.user._id,
                    driverNumber: res?.user.driverInfo.driverNumber,
                    fullName: res?.user.fullName,
                    phone: res?.user.phone,
                    licenseNumber: res?.user.driverInfo.licenseNumber,
                    licenseClass: res?.user.driverInfo.licenseClass,
                    status: res?.user.driverInfo.status,
                    assignedBus: res?.user.driverInfo.assignedBus,
                });
            } else {
                setDriver(null);
            }
        } catch (error) {
            console.error("Search driver error:", error);
        }
    };

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <label htmlFor="search" className={cx("search")}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Find driver"
                        value={searchValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </label>
                <div className={cx("filter-wrapper")}>
                    <Filter
                        firstTitle={"By status"}
                        ActiveFirstTitle={ActiveFirstTitle}
                        setActiveFirstTitle={setActiveFirstTitle}
                    />
                </div>
                <div className={cx("bus-list")}>
                    <DriverList
                        driver={driver}
                        setDriverDetail={setDriverDetail}
                        driverDetail={driverDetail}
                    />
                </div>
            </div>
            <div className={cx("right-block")}>
                <DriverDetail
                    driverDetail={driverDetail}
                    setDriverDetail={setDriverDetail}
                />
            </div>
        </div>
    );
};

export default DriverTab;
