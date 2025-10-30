import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/StudentDetail.module.scss";
import * as UserService from "../../../service/UserService";
import * as UserController from "../../../controller/UserController";
import toast, { Toaster } from "react-hot-toast";

const cx = classNames.bind(styles);

const StudentDetail = ({ studentDetail, setStudentDetail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [studentUpdate, setStudentUpdate] = useState(studentDetail || {});
    console.log(studentUpdate.parentPhone);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentUpdate((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await UserController.updateStudentInfo(studentUpdate);
            if (res?.success) {
                setStudentDetail(studentUpdate);
                toast.success("Cập nhật học sinh thành công");
                setIsEditing(false);
            } else {
                toast.error(res?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật");
        }
    };

    // Đồng bộ props -> state
    useEffect(() => {
        setStudentUpdate(studentDetail || {});
    }, [studentDetail]);

    return (
        <div className={cx("studentDetailWrapper")}>
            {studentDetail?._id ? (
                <>
                    {" "}
                    <h4>Student Detail</h4>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Student Number:</span>
                        <span className={cx("value")}>
                            {studentUpdate.studentNumber}
                        </span>
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Last Update:</span>
                        <span className={cx("value")}>
                            {studentUpdate.lastUpdate || "N/A"}
                        </span>
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Name:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="fullName"
                                value={studentUpdate.fullName || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className={cx("value")}>
                                {studentUpdate.fullName}
                            </span>
                        )}
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Class:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="className"
                                value={studentUpdate.className || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className={cx("value")}>
                                {studentUpdate.className}
                            </span>
                        )}
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Parent Name:</span>
                        <span className={cx("value")}>
                            {studentUpdate.parentName}
                        </span>
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Parent Phone:</span>
                        <span className={cx("value")}>
                            {studentUpdate.parentPhone}
                        </span>
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Status:</span>
                        {isEditing ? (
                            <select
                                name="status"
                                value={studentUpdate.status || ""}
                                onChange={handleChange}
                            >
                                <option value="Đang đi học">Đang đi học</option>
                                <option value="Vắng mặt">Vắng mặt</option>
                                <option value="Ngừng tham gia">
                                    Ngừng tham gia
                                </option>
                            </select>
                        ) : (
                            <span className={cx("value")}>
                                {studentUpdate.status || "Chưa cập nhật"}
                            </span>
                        )}
                    </div>
                    <div className={cx("row")}>
                        <span className={cx("label")}>Assigned Bus:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="assignedBus"
                                value={studentUpdate.registeredBus || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className={cx("value")}>
                                {studentUpdate.registeredBus || "N/A"}
                            </span>
                        )}
                    </div>
                    <div className={cx("btnGroup")}>
                        {isEditing ? (
                            <>
                                <button
                                    className={cx("cancelBtn")}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={cx("saveBtn")}
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                className={cx("editBtn")}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p>Choose one from the list to see details.</p>
            )}

            <Toaster position="top-right" />
        </div>
    );
};

export default StudentDetail;
