import React from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/MyScheduleTab.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const MyScheduleTab = () => {
  const navigate = useNavigate();
  // Dữ liệu mẫu
  const schedules = [
    {
      id: 1,
      route: "Trường → Điểm A → Điểm B → Trường",
      startTime: "07:00",
      eta: "07:45",
      status: "Chưa khởi hành",
    },
    {
      id: 2,
      route: "Trường → Điểm C → Điểm D → Trường",
      startTime: "11:30",
      eta: "12:15",
      status: "Hoàn thành",
    },
    {
      id: 3,
      route: "Trường → Điểm E → Điểm F → Trường",
      startTime: "16:00",
      eta: "16:50",
      status: "Đang chạy",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Chưa khởi hành":
        return cx("pending");
      case "Đang chạy":
        return cx("running");
      case "Hoàn thành":
        return cx("done");
      default:
        return "";
    }
  };

  return (
    <div className={cx("schedule-wrapper")}>
      <h2>Lịch trình của tôi</h2>
      <table className={cx("schedule-table")}>
        <thead>
          <tr>
            <th>Chuyến</th>
            <th>Tuyến đường</th>
            <th>Xuất phát</th>
            <th>Dự kiến đến</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((trip) => (
            <tr key={trip.id} onClick={() => navigate(`/tracking/${trip.id}`)}>
              <td>{trip.id}</td>
              <td>{trip.route}</td>
              <td>{trip.startTime}</td>
              <td>{trip.eta}</td>
              <td className={getStatusClass(trip.status)}>{trip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyScheduleTab;
