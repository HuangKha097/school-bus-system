import React from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/Page.module.scss";
import NavBar from "../components/NavBar";
import BusTab from "../components/manager/BusTab";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import DriverTab from "../components/manager/DriverTab";
import StudentTab from "../components/manager/StudentTab";
import TrackingTab from "../components/manager/TrackingTab";
import ScheduleTab from "../components/manager/ScheduleTab";

const cx = classNames.bind(styles);
const ManagerPage = ({ role, setRole, userName }) => {
  return (
    <div>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("left-block")}>
            <NavBar role={role} setRole={setRole} userName={userName} />
          </div>
          <div className={cx("right-block")}>
            <Routes>
              <Route path="/bus" element={<BusTab />} />
              <Route path="/driver" element={<DriverTab />} />
              <Route path="/student" element={<StudentTab />} />
              <Route path="/schedule" element={<ScheduleTab />} />
              <Route path="/tracking" element={<TrackingTab />}>
                <Route path=":id" element={<TrackingTab />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
