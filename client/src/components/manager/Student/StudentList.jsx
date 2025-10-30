import React, { useEffect, useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/StudentList.module.scss";
import * as UserController from "../../../controller/UserController";

const cx = classNames.bind(styles);

const StudentList = ({
    setStudentDetail,
    studentDetail,
    student,
    showSelectCheck,
    setStudentsSelected,
    studentsSelected,
    studentPopUp,
    studentsHaveBus = [],
}) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudentList = async () => {
            try {
                const res = await UserController.fetchUserByRole("parent");
                if (Array.isArray(res)) {
                    const allChildren = res.flatMap((parent) =>
                        (parent.parentInfo?.children || []).map((child) => ({
                            _id: child._id,
                            studentNumber: child.studentNumber,
                            name: child.name,
                            grade: child.grade,
                            status: child.status,
                            parentName: parent.fullName,
                            parentPhone: parent.phone,
                            registeredBus: child.registeredBus,
                        }))
                    );
                    setStudents(allChildren);
                }
            } catch (error) {
                console.error("Fetch student list error:", error);
            }
        };
        fetchStudentList();
    }, [student, studentDetail]);

    //  Tạo danh sách hiển thị
    const displayStudents = useMemo(() => {
        // Nếu có popup chỉ hiển thị những học sinh chưa có bus
        if (Array.isArray(studentPopUp)) {
            if (studentPopUp.length === 0) {
                // Khi popup mới mở, chưa tìm kiếm  ẩn danh sách
                return [];
            }

            // Lọc học sinh chưa có trong studentsHaveBus
            return studentPopUp.filter(
                (s) => !studentsHaveBus.some((h) => h._id === s._id)
            );
        }

        // Nếu có student từ props  hiển thị luôn
        if (Array.isArray(student) && student.length > 0) {
            return student;
        }

        // Mặc định hiển thị tất cả (trang StudentTab)
        return students;
    }, [studentPopUp, student, students, studentsHaveBus]);

    //   Chọn 1 học sinh
    const handleSelectStudent = (student) => {
        setStudentsSelected?.((prev) => {
            const isSelected = prev.some((s) => s._id === student._id);
            if (isSelected) {
                return prev.filter((s) => s._id !== student._id);
            } else {
                return [...prev, student];
            }
        });
    };

    //  Chọn tất cả
    const handleToggleSelectAll = () => {
        setStudentsSelected?.((prev) => {
            if (prev.length === displayStudents.length) return [];
            return [...displayStudents];
        });
    };

    const isAllSelected =
        displayStudents.length > 0 &&
        studentsSelected?.length === displayStudents.length;

    return (
        <table className={cx("table")}>
            <thead>
                <tr>
                    {showSelectCheck && (
                        <th>
                            <input
                                type="checkbox"
                                onChange={handleToggleSelectAll}
                                checked={isAllSelected}
                            />
                        </th>
                    )}
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Parent Phone</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {displayStudents.length === 0 ? (
                    <tr>
                        <td
                            colSpan="6"
                            style={{ textAlign: "center", padding: "10px" }}
                        >
                            {Array.isArray(studentPopUp)
                                ? "Nhập từ khóa để tìm học sinh."
                                : "Không tìm thấy học sinh."}
                        </td>
                    </tr>
                ) : (
                    displayStudents.map((item, index) => {
                        const isChecked = studentsSelected?.some(
                            (s) => s._id === item._id
                        );

                        return (
                            <tr
                                key={item._id || index}
                                onClick={() =>
                                    setStudentDetail?.({
                                        _id: item._id,
                                        studentNumber: item.studentNumber,
                                        fullName: item.name,
                                        className: item.grade,
                                        status: item.status,
                                        parentName: item.parentName,
                                        parentPhone: item.parentPhone,
                                        registeredBus: item.registeredBus,
                                    })
                                }
                            >
                                {showSelectCheck && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={() =>
                                                handleSelectStudent(item)
                                            }
                                            checked={isChecked}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                )}
                                <td>{item.studentNumber || "N/A"}</td>
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
                        );
                    })
                )}
            </tbody>
        </table>
    );
};

export default StudentList;
