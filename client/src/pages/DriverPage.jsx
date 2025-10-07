import React from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";

import MyScheduleTab from "../components/driver/MyScheduleTab";
import TrackingTab from "../components/driver/TrackingTab";
import StudentListTab from "../components/driver/StudentListTab";
import ReportTab from "../components/driver/ReportTab";

const cx = classNames.bind(styles);
const DriverPage = ({ role, setRole, userName }) => {
  return (
    <div>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("left-block")}>
            <NavBar role={role} setRole={setRole} userName={userName} />
          </div>

          <div className={cx("right-block")}>
            <Routes>
              <Route path="/myschedule" element={<MyScheduleTab />} />

              <Route path="/tracking" element={<TrackingTab />}>
                <Route path=":id" element={<TrackingTab />} />
              </Route>
              <Route path="/students-list" element={<StudentListTab />} />
              <Route path="/report" element={<ReportTab />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPage;
