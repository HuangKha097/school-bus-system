import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import RouteDetail from "./Schedule/RouteDetail";
import * as RouteService from "../../service/RouteService.js";
import RouteList from "./Schedule/RouteList.jsx";

const cx = classNames.bind(styles);

const ScheduleTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [routeDetail, setRouteDetail] = useState(null);

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <label htmlFor="search" className={cx("search")}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Find route"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </label>
                <div className={cx("bus-list")}>
                    <RouteList
                        routeDetail={routeDetail}
                        setRouteDetail={setRouteDetail}
                    />
                </div>
            </div>

            <div className={cx("right-block")}>
                <RouteDetail
                    routeDetail={routeDetail}
                    setRouteDetail={setRouteDetail}
                />
            </div>
        </div>
    );
};

export default ScheduleTab;
