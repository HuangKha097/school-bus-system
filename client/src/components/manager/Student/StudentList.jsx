import React, { useEffect, useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/StudentList.module.scss";
import * as UserService from "../../../service/UserService";

const cx = classNames.bind(styles);

const StudentList = ({
    setStudentDetail,
    studentDetail,
    student,
    showSelectCheck,
    setStudentsSelected,
    studentsSelected,
    studentPopUp,
}) => {
    const [students, setStudents] = useState([]);
    console.log(students);

    useEffect(() => {
        const fetchStudentList = async () => {
            try {
                const res = await UserService.getUserByRole("parent");
                if (res?.success && Array.isArray(res.data)) {
                    const allChildren = res.data.flatMap((parent) =>
                        (parent.parentInfo?.children || []).map((child) => ({
                            _id: child._id, // ID   làm key
                            childName: child.name,
                            parent: parent._id,

                            ...child,
                            name: child.name,
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
    }, [student, studentDetail]);

    // displayStudents
    const displayStudents = useMemo(() => {
        if (Array.isArray(studentPopUp) && studentPopUp.length > 0) {
            return studentPopUp;
        }
        if (Array.isArray(student) && student.length > 0) {
            return student;
        }
        return students;
    }, [studentPopUp, student, students]);
    console.log("====================================");
    console.log("display: ", displayStudents);
    console.log("====================================");

    //  xử lý chọn/bỏ chọn 1 học sinh
    const handleSelectStudent = (student) => {
        setStudentsSelected((prev) => {
            const isSelected = prev.some((s) => s._id === student._id);

            if (isSelected) {
                return prev.filter((s) => s._id !== student._id);
            } else {
                return [...prev, student];
            }
        });
    };

    //  xử lý chọn/bỏ chọn TẤT CẢ
    const handleToggleSelectAll = () => {
        setStudentsSelected((prev) => {
            if (prev.length === displayStudents.length) {
                return [];
            }

            return [...displayStudents];
        });
    };
    //  Tính toán xem "Select All" có được check không
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
                {displayStudents.map((item, index) => {
                    const isChecked = studentsSelected?.some(
                        (s) => s._id === item._id
                    );

                    return (
                        <tr
                            key={item._id || index}
                            onClick={() =>
                                studentDetail &&
                                setStudentDetail({
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
                })}
            </tbody>
        </table>
    );
};

export default StudentList;
