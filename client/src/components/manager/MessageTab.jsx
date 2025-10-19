import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/MessageTab.module.scss";
import { jwtDecode } from "jwt-decode";

import * as UserService from "../../service/UserService.js";

const cx = classNames.bind(styles);

const API_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const MODEL_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!API_KEY) {
    console.error(" kiểm tra lại API Key ");
}

const MessageTab = () => {
    const token = localStorage.getItem("token");

    const [messageType, setMessageType] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [targetRecipient, setTargetRecipient] = useState("");
    const [customMessage, setCustomMessage] = useState("");

    const [recipientList, setRecipientList] = useState([]);

    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [historyMessage, setHistoryMessage] = useState([]);
    console.log(historyMessage);

    const [aiError, setAiError] = useState(null);
    const [sendError, setSendError] = useState(null);

    useEffect(() => {
        const fetchHistoryMessage = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const managerId = decodedToken.userId;
                    if (managerId) {
                        const res = await UserService.getMessageHistory(
                            managerId
                        );
                        if (res.success) {
                            setHistoryMessage(res.data);
                        }
                    }
                }
            } catch (error) {
                console.error("Không thể tải lịch sử tin nhắn:", error);
            }
        };
        fetchHistoryMessage();
    }, [historyMessage.length]);
    useEffect(() => {
        const fetchRecipients = async () => {
            if (targetRole === "parent" || targetRole === "driver") {
                try {
                    const res = await UserService.getUserByRole(targetRole);
                    setRecipientList(res?.data || []);
                } catch (error) {
                    console.log("Lỗi fetch user:", error);
                    setRecipientList([]);
                }
            } else {
                setRecipientList([]);
            }
        };

        fetchRecipients();
        setTargetRecipient("");
    }, [targetRole]);

    const handleSend = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setSendError(null);

        try {
            const decodedToken = jwtDecode(token);
            const senderId = decodedToken.userId;
            if (!senderId)
                throw new Error(
                    "Token không hợp lệ, không tìm thấy ID người gửi."
                );

            let res;
            const isSendingToAll =
                targetRole === "all_parents" || targetRole === "all_drivers";

            if (isSendingToAll) {
                const roleToSend =
                    targetRole === "all_parents" ? "parent" : "driver";
                const messageData = {
                    role: roleToSend,
                    content: customMessage,
                    messageType: messageType,
                    senderId: senderId,
                };
                res = await UserService.sendMessageToRole(messageData);
            } else {
                const messageData = {
                    userId: targetRecipient,
                    content: customMessage,
                    messageType: messageType,
                    senderId: senderId,
                };
                res = await UserService.sendMessage(messageData);
            }

            if (res?.success) {
                alert(res.message || "Tin nhắn đã được gửi thành công!");

                // Reset form
                setCustomMessage("");
                setMessageType("");
                setTargetRecipient("");
                setTargetRole("");
            } else {
                setSendError(res.message || "Có lỗi xảy ra khi gửi.");
            }
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            setSendError(
                error.response?.data?.message ||
                    error.message ||
                    "Không thể kết nối đến server."
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleAiGenerate = async (e) => {
        e.preventDefault();

        if (!API_KEY) {
            setAiError("Lỗi cấu hình: Không tìm thấy API Key.");
            return;
        }

        setIsAiLoading(true);
        setAiError(null);

        const getSelectedText = (selectId) => {
            const select = document.getElementById(selectId);
            if (select && select.selectedIndex >= 0 && select.value !== "") {
                return select.options[select.selectedIndex].text.trim();
            }
            return "";
        };

        const messageTypeText = getSelectedText("messageType");
        const targetRoleText = getSelectedText("targetRole");
        const recipientText = getSelectedText("targetRecipient");

        if (!messageType || !targetRole) {
            setAiError("Vui lòng chọn Loại thông báo và Vai trò trước.");
            setIsAiLoading(false);
            return;
        }

        const targetDescription = recipientText || targetRoleText;

        const systemPrompt = `Bạn là trợ lý ảo chuyên nghiệp của hệ thống trường học.
Nhiệm vụ của bạn là soạn thảo tin nhắn thông báo lịch sự, trang trọng bằng tiếng Việt gửi đến phụ huynh hoặc tài xế.
Nội dung tin nhắn phải có **ít nhất 15 từ**.
Tuyệt đối chỉ trả về nội dung tin nhắn, không thêm bất kỳ lời chào, giải thích, hay ký tự đặc biệt nào (như [BOT] hay <s>).`;

        const userPrompt = `Dựa vào thông tin sau:
- Loại thông báo: "${messageTypeText}"
- Người nhận: "${targetDescription}"
Hãy viết nội dung tin nhắn.
Lưu ý quan trọng: Nếu loại thông báo liên quan đến học sinh (ví dụ: "Học sinh... đã lên/xuống xe") VÀ người nhận là cụ thể (ví dụ: "Phụ huynh em Trần Thị B"), hãy tự động điền tên học sinh vào nội dung (ví dụ: "Em Trần Thị B đã lên xe an toàn.").`;

        try {
            const response = await fetch(MODEL_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Do An Cong Nghe Phan Mem",
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct:free",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    max_tokens: 150,
                    temperature: 0.3,
                }),
            });

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => response.text());
                if (response.status === 401) {
                    throw new Error(
                        "Lỗi 401: API Key không hợp lệ hoặc đã bị xóa."
                    );
                }
                const errorMessage =
                    typeof errorData === "string"
                        ? errorData
                        : errorData?.error?.message ||
                          `Lỗi ${response.status}: Lỗi không xác định từ API.`;
                throw new Error(errorMessage);
            }

            const result = await response.json();

            if (
                result.choices &&
                result.choices.length > 0 &&
                result.choices[0].message
            ) {
                let generatedText = result.choices[0].message.content;
                const cleanedText = generatedText
                    .replace(/<s>|<\/s>|\[INST]|\[\/INST]|\[BOT]|\[\/BOT]/g, "")
                    .trim();
                setCustomMessage(cleanedText);
            } else {
                console.error(result);
            }
        } catch (err) {
            console.error("Lỗi gọi AI:", err);
            setAiError(
                err.message || "Không thể tạo nội dung. Vui lòng thử lại."
            );
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className={cx("tab-wrapper")}>
            <div className={cx("left-block")}>
                <div className={cx("history-wrapper")}>
                    <h3>Lịch sử tin nhắn</h3>
                    <ul className={cx("history-list")}>
                        {historyMessage.length === 0 ? (
                            <li style={{ color: "#888", fontStyle: "italic" }}>
                                Chưa có lịch sử tin nhắn.
                            </li>
                        ) : (
                            historyMessage.map((item) => (
                                <li
                                    key={item._id}
                                    className={cx("history-item")}
                                >
                                    <div className={cx("item-header")}>
                                        <strong>
                                            Đến:
                                            {item
                                                ? item._id
                                                : item.recipientRole ||
                                                  "Không rõ"}
                                        </strong>
                                        <span className={cx("item-date")}>
                                            {item.sentAt}
                                        </span>
                                    </div>
                                    <div className={cx("item-body")}>
                                        <span className={cx("item-type")}>
                                            [{item.messageType}]
                                        </span>
                                        <p>{item.content}</p>
                                    </div>
                                </li>
                            ))
                        )}
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

                        {recipientList &&
                            recipientList.length > 0 &&
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

                                        {recipientList.map((recipient) => {
                                            let label = recipient.fullName;

                                            if (
                                                recipient.role === "parent" &&
                                                recipient.parentInfo?.children
                                                    ?.length > 0
                                            ) {
                                                const childrenNames =
                                                    recipient.parentInfo.children
                                                        .map((c) => c.name)
                                                        .join(", ");
                                                label += ` (Phụ huynh em: ${childrenNames})`;
                                            } else if (
                                                recipient.role === "driver" &&
                                                recipient.driverInfo
                                                    ?.driverNumber
                                            ) {
                                                label += ` (${recipient.driverInfo.driverNumber})`;
                                            }

                                            return (
                                                <option
                                                    key={recipient._id}
                                                    value={recipient._id}
                                                >
                                                    {label}{" "}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}

                        <div className={cx("form-group")}>
                            <label htmlFor="customMessage">
                                Nội dung tin nhắn
                            </label>

                            <button
                                type="button"
                                className={cx("ai-btn")}
                                onClick={handleAiGenerate}
                                disabled={isAiLoading || !API_KEY || isSending}
                            >
                                {isAiLoading
                                    ? "Đang tạo..."
                                    : "Nội dung tự động với AI"}
                            </button>

                            {aiError && (
                                <span className={cx("error-text")}>
                                    {aiError}
                                </span>
                            )}

                            <textarea
                                id="customMessage"
                                value={customMessage}
                                onChange={(e) =>
                                    setCustomMessage(e.target.value)
                                }
                                className={cx({ "ai-loading": isAiLoading })}
                                placeholder="Nhập nội dung tin nhắn...  "
                                rows={5}
                                readOnly={isAiLoading || isSending}
                                required
                            />
                        </div>

                        {sendError && (
                            <span
                                className={cx("error-text")}
                                style={{ marginBottom: "1rem" }}
                            >
                                {sendError}
                            </span>
                        )}

                        <button
                            type="submit"
                            className={cx("send-button")}
                            disabled={isSending}
                        >
                            {isSending ? "Đang gửi..." : "Gửi thông báo"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessageTab;
