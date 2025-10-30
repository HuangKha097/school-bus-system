import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import StudentList from "./Student/StudentList";
import StudentDetail from "./Student/StudentDetail";
import * as UserController from "../../controller/UserController";
import Filter from "../Filter.jsx";

const cx = classNames.bind(styles);

const StudentTab = () => {
    const [ActiveFirstTitle, setActiveFirstTitle] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [student, setStudent] = useState(null);
    const [studentDetail, setStudentDetail] = useState({
        _id: "",
        studentNumber: "",
        parentId: "",
        fullName: "",
        className: "",
        status: "",
        parentName: "",
        parentPhone: "",
        registeredBus: "",
    });
    console.log(searchValue);
    console.log(studentDetail);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            findStudents(searchValue);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (!value.trim()) {
            setStudent(null); // reset khi input trống
        }
    };

    const findStudents = async () => {
        try {
            if (!searchValue.trim()) {
                setStudent(null);
                return;
            }
            const res = await UserController.findStudents(
                ActiveFirstTitle,
                searchValue
            );
            console.log(res);

            if (res?.success && res?.students) {
                setStudent(res?.students);
            } else {
                setStudent(null);
            }
        } catch (error) {
            console.error("Search student error:", error);
        }
    };

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <label htmlFor="search" className={cx("search")}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Find student"
                        value={searchValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </label>
                <div className={cx("filter-wrapper")}>
                    <Filter
                        firstTitle={"By class"}
                        ActiveFirstTitle={ActiveFirstTitle}
                        setActiveFirstTitle={setActiveFirstTitle}
                    />
                </div>
                <div className={cx("bus-list")}>
                    <StudentList
                        student={student}
                        setStudentDetail={setStudentDetail}
                        studentDetail={studentDetail}
                    />
                </div>
            </div>
            <div className={cx("right-block")}>
                <StudentDetail
                    studentDetail={studentDetail}
                    setStudentDetail={setStudentDetail}
                />
            </div>
        </div>
    );
};

export default StudentTab;
