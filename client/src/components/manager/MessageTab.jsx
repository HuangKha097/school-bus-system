import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/MessageTab.module.scss";

const cx = classNames.bind(styles);

// Dữ liệu giả lập để minh họa
const mockRecipients = {
    parent: [
        { id: "p1", name: "Phụ huynh em Nguyễn Văn A" },
        { id: "p2", name: "Phụ huynh em Trần Thị B" },
        { id: "p3", name: "Phụ huynh em Lê Văn C" },
    ],
    driver: [
        { id: "d1", name: "Tài xế Lý Văn Tín (BUS001)" },
        { id: "d2", name: "Tài xế Trần Văn Tài (BUS002)" },
        { id: "d3", name: "Tài xế Đỗ Văn Dũng (BUS003)" },
    ],
};

const mockHistory = [
    {
        id: "h1",
        to: "Tài xế Lý Văn Tín (BUS001)",
        date: "2025-10-18 14:30",
        message: "Học sinh Nguyễn Văn A đã xuống xe an toàn.",
        type: "Học sinh xuống xe",
    },
    {
        id: "h2",
        to: "Tất cả phụ huynh",
        date: "2025-10-18 08:15",
        message:
            "Do thời tiết xấu, xe buýt có thể đến trễ 10-15 phút. Mong quý vị thông cảm.",
        type: "Thông báo chung",
    },
    {
        id: "h3",
        to: "Phụ huynh em Trần Thị B",
        date: "2025-10-18 07:45",
        message: "Em Trần Thị B đã lên xe.",
        type: "Học sinh lên xe",
    },

    {
        id: "h4",
        to: "Tất cả Tài xế",
        date: "2025-10-17 16:00",
        message: "Nhắc nhở: Vui lòng kiểm tra và vệ sinh xe sau mỗi chuyến đi.",
        type: "Thông báo chung",
    },
    {
        id: "h5",
        to: "Phụ huynh em Lê Văn C",
        date: "2025-10-17 07:50",
        message: "Em Lê Văn C đã lên xe.",
        type: "Học sinh lên xe",
    },
    {
        id: "h5",
        to: "Phụ huynh em Lê Văn C",
        date: "2025-10-17 07:50",
        message: "Em Lê Văn C đã lên xe.",
        type: "Học sinh lên xe",
    },
    {
        id: "h5",
        to: "Phụ huynh em Lê Văn C",
        date: "2025-10-17 07:50",
        message: "Em Lê Văn C đã lên xe.",
        type: "Học sinh lên xe",
    },
    {
        id: "h5",
        to: "Phụ huynh em Lê Văn C",
        date: "2025-10-17 07:50",
        message: "Em Lê Văn C đã lên xe.",
        type: "Học sinh lên xe",
    },
];

const MessageTab = () => {
    const [messageType, setMessageType] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [targetRecipient, setTargetRecipient] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [recipientList, setRecipientList] = useState([]);

    useEffect(() => {
        if (targetRole === "parent") {
            setRecipientList(mockRecipients.parent);
        } else if (targetRole === "driver") {
            setRecipientList(mockRecipients.driver);
        } else {
            setRecipientList([]);
        }
        setTargetRecipient("");
    }, [targetRole]);

    const handleSend = (e) => {
        e.preventDefault();
        const messageData = {
            messageType,
            targetRole,
            targetRecipient: targetRecipient || "all",
            customMessage,
            sentAt: new Date().toISOString(),
        };
        console.log("Sending message:", messageData);
        alert("Tin nhắn đã được gửi (xem console)!");

        setMessageType("");
        setTargetRole("");
        setCustomMessage("");
        setTargetRecipient("");
    };

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <div className={cx("history-wrapper")}>
                    <h3>Lịch sử tin nhắn</h3>
                    <ul className={cx("history-list")}>
                        {mockHistory.map((item) => (
                            <li key={item.id} className={cx("history-item")}>
                                <div className={cx("item-header")}>
                                    <strong>Đến: {item.to}</strong>
                                    <span className={cx("item-date")}>
                                        {item.date}
                                    </span>
                                </div>
                                <div className={cx("item-body")}>
                                    <span className={cx("item-type")}>
                                        [{item.type}]
                                    </span>
                                    <p>{item.message}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={cx("right-block")}>
                <div className={cx("composer-wrapper")}>
                    <h3>Soạn tin nhắn mới</h3>
                    <form className={cx("composer-form")} onSubmit={handleSend}>
                        <div className={cx("form-group")}>
                            <label htmlFor="messageType">Loại thông báo</label>
                            <select
                                id="messageType"
                                value={messageType}
                                onChange={(e) => setMessageType(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Chọn mẫu thông báo...
                                </option>
                                <option value="student_on_bus">
                                    Học sinh... đã lên xe
                                </option>
                                <option value="student_off_bus">
                                    Học sinh... đã xuống xe
                                </option>
                                <option value="bus_delayed">
                                    Xe buýt... bị trễ
                                </option>
                                <option value="bus_arrived">
                                    Xe buýt... đã đến điểm
                                </option>
                                <option value="general_announcement">
                                    Thông báo chung
                                </option>
                            </select>
                        </div>

                        <div className={cx("form-group")}>
                            <label htmlFor="targetRole">
                                Gửi đến (Vai trò)
                            </label>
                            <select
                                id="targetRole"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Chọn vai trò...
                                </option>
                                <option value="parent">Phụ huynh</option>
                                <option value="driver">Tài xế</option>
                                <option value="all_parents">
                                    Tất cả Phụ huynh
                                </option>
                                <option value="all_drivers">
                                    Tất cả Tài xế
                                </option>
                            </select>
                        </div>

                        {recipientList.length > 0 &&
                            (targetRole === "parent" ||
                                targetRole === "driver") && (
                                <div className={cx("form-group")}>
                                    <label htmlFor="targetRecipient">
                                        Người nhận cụ thể
                                    </label>
                                    <select
                                        id="targetRecipient"
                                        value={targetRecipient}
                                        onChange={(e) =>
                                            setTargetRecipient(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="" disabled>
                                            Chọn người nhận cụ thể...
                                        </option>
                                        {recipientList.map((recipient) => (
                                            <option
                                                key={recipient.id}
                                                value={recipient.id}
                                            >
                                                {recipient.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        <div className={cx("form-group")}>
                            <label htmlFor="customMessage">
                                Nội dung tin nhắn
                            </label>
                            <button
                                className={cx("ai-btn")}
                                onClick={(e) => e.preventDefault()}
                            >
                                Nội dung tự động với AI
                            </button>
                            <textarea
                                id="customMessage"
                                value={customMessage}
                                onChange={(e) =>
                                    setCustomMessage(e.target.value)
                                }
                                placeholder="Nhập nội dung tin nhắn... (Nếu dùng mẫu, nội dung này sẽ được đính kèm)"
                                rows={5}
                            />
                        </div>

                        <button type="submit" className={cx("send-button")}>
                            Gửi thông báo
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessageTab;
