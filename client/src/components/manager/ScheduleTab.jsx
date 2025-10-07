import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import RouteList from "./Schedule/RouteList";
import RouteDetail from "./Schedule/RouteDetail";

const cx = classNames.bind(styles);

const ScheduleTab = () => {
  const [searchValue, setSearchValue] = useState("");
  const [routeDetail, setRouteDetail] = useState(null);

  const routes = [
    {
      routeId: "ROUTE001",
      busNumber: "BUS001",
      driverName: "Nguyễn Văn A",
      startTime: "06:30",
      endTime: "07:30",
      status: "Đang hoạt động",
      students: [
        { name: "Trần Gia Bảo", class: "6A2" },
        { name: "Phạm Hoàng My", class: "6A3" },
      ],
    },
    {
      routeId: "ROUTE002",
      busNumber: "BUS002",
      driverName: "Phạm Thanh Huy",
      startTime: "06:45",
      endTime: "07:40",
      status: "Đang hoạt động",
      students: [{ name: "Nguyễn Minh Quân", class: "7A1" }],
    },
  ];

  const filteredRoutes = routes.filter((r) =>
    r.routeId.toLowerCase().includes(searchValue.toLowerCase())
  );

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
          <RouteList routes={filteredRoutes} setRouteDetail={setRouteDetail} />
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
