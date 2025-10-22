import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/StudentListTab.module.scss";

const cx = classNames.bind(styles);

const StudentListTab = ({ students, route }) => {
    return (
        <div className={cx("student-list-wrapper")}>
            <h2>Danh sách học sinh trên xe</h2>
            <table className={cx("student-table")}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên học sinh</th>

                        <th>Điểm trả</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {students &&
                        students?.map((s, index) => (
                            <tr key={s._id}>
                                <td>{index + 1}</td>
                                <td>{s.name}</td>

                                <td>{route?.name}</td>
                                <td>{s.status}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentListTab;
