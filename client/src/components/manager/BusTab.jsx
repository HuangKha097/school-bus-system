import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import BusList from "../manager/Bus/BusList";
import BusDetail from "../manager/Bus/BusDetail";
import * as BusService from "../../service/BusService";

const cx = classNames.bind(styles);

const BusTab = () => {
    const [busNumber, setBusNumber] = useState("");
    const [bus, setBus] = useState(null);
    const [busDetail, setBusDetail] = useState({
        busId: "",
        driver: {},
        routeNumber: "",
        licensePlate: "",
        busStatus: "",
        capacity: 0,
        currentStudents: 0,
        lastUpdate: "",
    });
    console.log("busDetail :", busDetail);

    const handleSearch = async () => {
        if (!busNumber.trim()) {
            setBus(null); // xoá search => quay về danh sách ban đầu
            return;
        }
        try {
            const res = await BusService.getBusesByBusNumber(busNumber);
            setBus(res?.data || null);
        } catch (error) {
            console.error("Search bus error:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setBusNumber(value);

        if (!value.trim()) {
            setBus(null); // reset nếu input rỗng
        }
    };

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <label htmlFor="search" className={cx("search")}>
                    <input
                        value={busNumber}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        type="text"
                        name="search"
                        placeholder="Find bus"
                    />
                </label>
                <div className={cx("bus-list")}>
                    <BusList
                        bus={bus}
                        setBusDetail={setBusDetail}
                        busDetail={busDetail}
                    />
                </div>
            </div>
            <div className={cx("right-block")}>
                <BusDetail busDetail={busDetail} setBusDetail={setBusDetail} />
            </div>
        </div>
    );
};

export default BusTab;
