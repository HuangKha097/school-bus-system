import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/StudentListTab.module.scss";

const cx = classNames.bind(styles);

const StudentListTab = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Nguyễn Văn B",
      pickup: "Cổng A",
      dropoff: "Trường",
      status: "Chưa lên xe",
    },
    {
      id: 2,
      name: "Trần Thị C",
      pickup: "Ngã 3 B",
      dropoff: "Trường",
      status: "Đã lên xe",
    },
    {
      id: 3,
      name: "Lê Văn D",
      pickup: "Chợ C",
      dropoff: "Trường",
      status: "Chưa lên xe",
    },
  ]);

  const toggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "Chưa lên xe"
                  ? "Đã lên xe"
                  : s.status === "Đã lên xe"
                    ? "Xuống xe"
                    : "Chưa lên xe",
            }
          : s
      )
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Chưa lên xe":
        return cx("pending");
      case "Đã lên xe":
        return cx("onboard");
      case "Xuống xe":
        return cx("done");
      default:
        return "";
    }
  };

  return (
    <div className={cx("student-list-wrapper")}>
      <h2>Danh sách học sinh trên xe</h2>
      <table className={cx("student-table")}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên học sinh</th>
            <th>Điểm đón</th>
            <th>Điểm trả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s.id}>
              <td>{index + 1}</td>
              <td>{s.name}</td>
              <td>{s.pickup}</td>
              <td>{s.dropoff}</td>
              <td className={getStatusClass(s.status)}>{s.status}</td>
              <td>
                <button
                  onClick={() => toggleStatus(s.id)}
                  className={cx("btn")}
                >
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListTab;
