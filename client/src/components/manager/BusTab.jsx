import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import BusList from "../manager/Bus/BusList";
import BusDetail from "../manager/Bus/BusDetail";
import Filter from "../Filter.jsx";

import * as BusController from "../../controller/BusController";
const cx = classNames.bind(styles);

const BusTab = () => {
    const [ActiveFirstTitle, setActiveFirstTitle] = useState(false);
    const [ActiveSecondTitle, setActiveSecondTitle] = useState(false);

    const [valueSearch, setValueSearch] = useState("");
    const [bus, setBus] = useState(null);

    const [busDetail, setBusDetail] = useState({
        _id: "",
        driver: {},
        routeNumber: "",
        licensePlate: "",
        busStatus: "",
        capacity: 0,
        currentStudents: 0,
        lastUpdate: "",
        students: [],
    });
    console.log("busDetail :", busDetail);

    const handleSearchBus = async () => {
        const response = await BusController.searchBus(
            ActiveSecondTitle,
            valueSearch
        );
        setBus(response);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchBus();
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setValueSearch(value);

        if (!value.trim()) {
            setBus(null); // reset nếu input rỗng
        }
    };

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <label htmlFor="search" className={cx("search")}>
                    <input
                        value={valueSearch}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        type="text"
                        name="search"
                        placeholder="Find bus"
                    />

                    <Filter
                        firstTitle={"By bus number"}
                        secondTitle={"By route"}
                        ActiveFirstTitle={ActiveFirstTitle}
                        setActiveFirstTitle={setActiveFirstTitle}
                        ActiveSecondTitle={ActiveSecondTitle}
                        setActiveSecondTitle={setActiveSecondTitle}
                    />
                </label>
                <div className={cx("filter-wrapper")}></div>
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
