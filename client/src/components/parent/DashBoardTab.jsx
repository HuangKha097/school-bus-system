import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/parent/DashboardTab.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const DashboardTab = ({ user }) => {
    const childrenList = user?.parentInfo?.children || [];
    console.log("====================================");
    console.log(childrenList);
    console.log("====================================");
    const [selectedChildIndex, setSelectedChildIndex] = useState(0);

    const getStatusInfo = (status) => {
        switch (status) {
            case "Đang đi học":
                return { className: "on-bus" };
            case "Đã đến trường":
                return { className: "at-school" };
            case "Đang về nhà":
                return { className: "going-home" };
            case "Vắng mặt":
                return { className: "absent" };
            default:
                return { className: "unknown" };
        }
    };

    if (childrenList.length === 0) {
        return (
            <div className={cx("dashboard-container")}>
                <h2>Dashboard</h2>
                <p>Không tìm thấy thông tin học sinh.</p>
            </div>
        );
    }

    const selectedChild = childrenList[selectedChildIndex];
    console.log("====================================");
    console.log(selectedChild);
    console.log("====================================");
    const statusInfo = getStatusInfo(selectedChild?.status);

    return (
        <div className={cx("dashboard-container")}>
            {childrenList.length > 1 && (
                <div className={cx("child-tabs")}>
                    {childrenList.map((child, index) => (
                        <button
                            key={child._id || child.studentNumber}
                            className={cx("tab-item", {
                                active: index === selectedChildIndex,
                            })}
                            onClick={() => setSelectedChildIndex(index)}
                        >
                            {child.name}
                        </button>
                    ))}
                </div>
            )}

            {selectedChild ? (
                <div className={cx("dashboard-content")}>
                    <h2>Dashboard của {selectedChild.name}</h2>

                    <div
                        className={cx(
                            "card",
                            "status-card",
                            statusInfo.className
                        )}
                    >
                        <span className={cx("status-icon")}>
                            {statusInfo.icon}
                        </span>
                        <div className={cx("status-text")}>
                            <p>Trạng thái</p>
                            <h3>{selectedChild.status || "Chưa cập nhật"}</h3>
                        </div>
                    </div>

                    <Link to={"/tracking"} className={cx("card-link")}>
                        <div className={cx("card", "action-card")}>
                            <span className={cx("action-icon")}>🗺️</span>
                            <h3>Theo dõi trên bản đồ</h3>
                            <p>Xem vị trí xe buýt theo thời gian thực </p>
                        </div>
                    </Link>

                    {/* Các thẻ thông tin chi tiết */}
                    <div className={cx("info-grid")}>
                        <div className={cx("card", "info-card")}>
                            <p>Xe buýt đăng ký</p>
                            <h4>
                                {selectedChild.registeredBus
                                    ? `...${selectedChild.registeredBus.slice(
                                          -8
                                      )}`
                                    : "N/A"}
                            </h4>
                        </div>
                        <div className={cx("card", "info-card")}>
                            <p>Mã số học sinh</p>
                            <h4>{selectedChild.studentNumber}</h4>
                        </div>
                        <div className={cx("card", "info-card")}>
                            <p>Lớp</p>
                            <h4>{selectedChild.grade}</h4>
                        </div>
                        <div className={cx("card", "info-card")}>
                            <p>SĐT (con)</p>
                            <h4>{selectedChild.phone}</h4>
                        </div>
                    </div>

                    <span className={cx("hot-line")}>
                        HotLine hỗ trợ: 0912345678
                    </span>
                </div>
            ) : (
                <p>Vui lòng chọn một học sinh để xem thông tin.</p>
            )}
        </div>
    );
};

export default DashboardTab;
