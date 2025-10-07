import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/StudentList.module.scss";
import * as UserService from "../../../service/UserService";

const cx = classNames.bind(styles);

const StudentList = ({ setStudentDetail, studentDetail, student }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const res = await UserService.getUserByRole("parent");
        console.log("API parents:", res);

        if (res?.success && Array.isArray(res.data)) {
          // Gộp tất cả học sinh từ các phụ huynh
          const allChildren = res.data.flatMap((parent) =>
            (parent.parentInfo?.children || []).map((child) => ({
              ...child,
              parentName: parent.fullName,
              parentPhone: parent.phone,
            }))
          );
          setStudents(allChildren);
        } else {
          console.warn("Unexpected API format:", res);
        }
      } catch (error) {
        console.error("Fetch student list error:", error);
      }
    };
    fetchStudentList();
  }, [studentDetail]);

  // Nếu có tìm kiếm, chỉ hiển thị 1 học sinh
  const displayStudents = student ? [student] : students;

  return (
    <table className={cx("table")}>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Class</th>
          <th>Parent Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {displayStudents.map((item, index) => (
          <tr
            key={item.studentNumber || index}
            onClick={() =>
              setStudentDetail({
                _id: item._id,
                fullName: item.name,
                className: item.grade,
                status: item.status,
                parentName: item.parentName,
                parentPhone: item.parentPhone,
              })
            }
          >
            <td>{item._id || "N/A"}</td>
            <td>{item.name}</td>
            <td>{item.grade}</td>
            <td>{item.parentPhone}</td>
            <td>
              <span
                className={cx(
                  "status",
                  item.status === "Đang đi học"
                    ? "active"
                    : item.status === "Vắng mặt"
                      ? "leave"
                      : "inactive"
                )}
              >
                {item.status || "Chưa cập nhật"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;
