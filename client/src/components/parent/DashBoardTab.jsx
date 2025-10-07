import React from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/parent/DashboardTab.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const DashboardTab = () => {
  const busInfo = {
    busId: "BUS001",
    driver: "Nguyễn Văn A",
    status: "Đang chạy",
    startTime: "07:00",
    eta: "07:20",
    currentStudents: 25,
    capacity: 40,
    route: "Trường → A → B → Trường",
  };

  return (
    <div className={cx("dashboard")}>
      <h2>Dashboard</h2>

      <div className={cx("row")}>
        <div className={cx("card")}>
          <h3>{busInfo.busId}</h3>
          <p>Xe buýt con bạn</p>
        </div>
        <div className={cx("card", "info")}>
          <h3>{busInfo.driver}</h3>
          <p>Tài xế phụ trách</p>
        </div>
      </div>

      <div className={cx("row")}>
        <div className={cx("card", "success")}>
          <h3>{busInfo.startTime}</h3>
          <p>Xuất phát</p>
        </div>
        <div className={cx("card", "warning")}>
          <h3>{busInfo.eta}</h3>
          <p>Dự kiến đến nơi</p>
        </div>
      </div>

      <div className={cx("row")}>
        <div className={cx("card", "statusCard")}>
          <h3>{busInfo.status}</h3>
          <p>Trạng thái</p>
        </div>
        <div className={cx("card", "students")}>
          <h3>
            {busInfo.currentStudents}/{busInfo.capacity}
          </h3>
          <p>Học sinh trên xe</p>
        </div>
        <Link to={"/tracking"}>
          <div className={cx("card", "routeCard")}>
            <div className={cx("header")}>
              <h3>📍</h3>
              <p>{busInfo.route}</p>
            </div>
            <p className={cx("more")}>Mở bản đồ →</p>
          </div>
        </Link>
      </div>
      <span className={cx("hot-line")}>HotLine: 0912345678</span>
    </div>
  );
};

export default DashboardTab;
