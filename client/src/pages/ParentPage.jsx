import React from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import NavBar from "../components/NavBar";

import NotificationTab from "../components/parent/NotificationTab";
import DashboardTab from "../components/parent/DashBoardTab";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tracking from "../components/Tracking";

const cx = classNames.bind(styles);

const ParentPage = ({ role, setRole, userName }) => {
  return (
    <div>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("left-block")}>
            <NavBar role={role} setRole={setRole} userName={userName} />
          </div>

          {/* Nội dung hiển thị */}
          <div className={cx("right-block")}>
            <Routes>
              <Route path="/dashboard" element={<DashboardTab />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/notifications" element={<NotificationTab />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPage;
