import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/BusTab.module.scss";
import StudentList from "./Student/StudentList";
import StudentDetail from "./Student/StudentDetail";
import * as UserService from "../../service/UserService";

const cx = classNames.bind(styles);

const StudentTab = () => {
  const [searchValue, setSearchValue] = useState("");
  const [student, setStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState({
    _id: "",
    fullName: "",
    className: "",
    status: "",
    parentName: "",
    parentPhone: "",
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getStudentByStudentNumber();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value.trim()) {
      setStudent(null); // reset khi input trống
    }
  };

  // const getStudentByStudentNumber = async () => {
  //   try {
  //     if (!searchValue.trim()) {
  //       setStudent(null);
  //       return;
  //     }

  //     // Gọi API: tìm student theo mã hoặc tên (qua parent)
  //     const res = await UserService.findStudentByNumber(searchValue);

  //     console.log("res: ", res?.student);

  //     if (res?.success && res?.student) {
  //       setStudent(res.student);
  //       setStudentDetail({
  //         _id: res.student._id,
  //         fullName: res.student.fullName,
  //         className: res.student.className,
  //         parentName: res.student.parentName,
  //         parentPhone: res.student.parentPhone,
  //       });
  //     } else {
  //       setStudent(null);
  //     }
  //   } catch (error) {
  //     console.error("Search student error:", error);
  //   }
  // };

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
