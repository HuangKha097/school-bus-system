import React from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/StudentListTab.module.scss";

const cx = classNames.bind(styles);

const StudentListTab = ({ students, route, buses }) => {
    // tìm bus đang chạy
    const activeBus = buses.find((b) => b.busStatus === "Đang chạy");

    // nếu có bus đang chạy, lọc học sinh theo danh sách bus đó
    const activeStudents = activeBus
        ? students.filter((s) =>
              activeBus.students.some(
                  (child) => String(child._id) === String(s._id)
              )
          )
        : [];

    return (
        <div className={cx("student-list-wrapper")}>
            <h2>Danh sách học sinh trên xe đang chạy</h2>
            <table className={cx("student-table")}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên học sinh</th>
                        <th>Điểm trả</th>
                        <th>Số điện thoại cá nhân</th>
                        <th>Số điện thoại cha mẹ</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {activeStudents.length > 0 ? (
                        activeStudents.map((s, index) => (
                            <tr key={s._id}>
                                <td>{index + 1}</td>
                                <td>{s.name}</td>
                                <td>{route?.name}</td>
                                <td>{s.phone}</td>
                                <td>{s.parentPhone}</td>
                                <td>{s.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                Không có học sinh nào trên xe đang chạy
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentListTab;
