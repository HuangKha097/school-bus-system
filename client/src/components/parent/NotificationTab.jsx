import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/parent/Notification.module.scss";

const cx = classNames.bind(styles);

// Helper function để định dạng ISO string
const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error("Lỗi định dạng ngày:", error);
        return "--:--";
    }
};

//  Dịch messageType sang Tiêu đề
const generateTitle = (messageType) => {
    switch (messageType) {
        case "bus_delayed":
            return "Xe buýt trễ giờ";
        case "bus_arriving":
            return "Xe buýt sắp đến";
        case "student_on_bus":
            return "Học sinh đã lên xe";
        case "student_off_bus":
            return "Học sinh đã xuống xe";
        case "general_announcement":
            return "Thông báo chung";
        default:
            return "Thông báo mới";
    }
};

const NotificationTab = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const rawHistory = user?.messageHistory || [];

        const formattedNotifications = rawHistory.map((item) => ({
            id: item._id,
            title: generateTitle(item.messageType),
            time: formatTime(item.sentAt),
            content: item.content,
            originalCreatedAt: item.sentAt,
            read: item.read,
        }));

        formattedNotifications.sort(
            (a, b) =>
                new Date(b.originalCreatedAt) - new Date(a.originalCreatedAt)
        );

        setNotifications(formattedNotifications);

        if (formattedNotifications.length > 0) {
            setSelected(formattedNotifications[0]);
        } else {
            setSelected(null);
        }
    }, [user]);

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <h3>Thông báo</h3>
                <ul className={cx("list")}>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <li
                                key={n.id}
                                className={cx("item", {
                                    active: selected?.id === n.id,
                                })}
                                onClick={() => setSelected(n)}
                            >
                                <div className={cx("title")}>{n.title}</div>
                                <div className={cx("time")}>{n.time}</div>
                            </li>
                        ))
                    ) : (
                        <li className={cx("item-empty")}>
                            Không có thông báo nào.
                        </li>
                    )}
                </ul>
            </div>

            <div className={cx("right-block")}>
                {selected ? (
                    <div className={cx("detail")}>
                        <h3>{selected.title}</h3>
                        <span className={cx("time")}>{selected.time}</span>

                        <p className={cx("content-display")}>
                            {selected.content}
                        </p>
                    </div>
                ) : (
                    <div className={cx("placeholder")}>
                        <p>Chọn một thông báo để xem chi tiết</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationTab;
