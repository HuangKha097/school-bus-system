import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/manager/MessageTab.module.scss";
import { jwtDecode } from "jwt-decode";
import * as UserService from "../../service/UserService.js";

const cx = classNames.bind(styles);
const API_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const MODEL_URL = import.meta.env.VITE_MODEL_UR;

const MessageTab = () => {
  const token = localStorage.getItem("token");
  const [messageType, setMessageType] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetRecipient, setTargetRecipient] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [recipientList, setRecipientList] = useState([]);
  const [historyMessage, setHistoryMessage] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    const fetchHistoryMessage = async () => {
      try {
        if (!token) return;
        const decodedToken = jwtDecode(token);
        const managerId = decodedToken.userId;
        if (managerId) {
          const res = await UserService.getMessageHistory(managerId);
          if (res.success) setHistoryMessage(res.data);
        }
      } catch (error) {
        console.error("Không thể tải lịch sử tin nhắn:", error);
      }
    };
    fetchHistoryMessage();
  }, []);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (targetRole === "parent" || targetRole === "driver") {
        try {
          const res = await UserService.getUserByRole(targetRole);
          setRecipientList(res?.data || []);
        } catch (error) {
          console.error("Lỗi lấy danh sách người dùng:", error);
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

    if (!messageType || !targetRole || !customMessage.trim()) {
      setSendError("Vui lòng nhập đầy đủ thông tin trước khi gửi.");
      setIsSending(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const senderId = decodedToken.userId;
      let res;
      const isSendToAll =
        targetRole === "all_parents" || targetRole === "all_drivers";

      if (isSendToAll) {
        const roleToSend = targetRole === "all_parents" ? "parent" : "driver";
        const messageData = {
          role: roleToSend,
          senderId,
          content: customMessage.trim(),
          messageType,
        };
        res = await UserService.sendMessageToRole(messageData);
      } else {
        const messageData = {
          senderId,
          userId: targetRecipient,
          content: customMessage.trim(),
          messageType,
        };
        res = await UserService.sendMessage(messageData);
      }

      if (res?.success) {
        alert(res.message || "Tin nhắn đã được gửi!");
        setCustomMessage("");
        setMessageType("");
        setTargetRole("");
        setTargetRecipient("");
        const updatedHistory = await UserService.getMessageHistory(senderId);
        if (updatedHistory.success) setHistoryMessage(updatedHistory.data);
      } else {
        setSendError(res.message || "Lỗi khi gửi tin nhắn.");
      }
    } catch (error) {
      console.error("Gửi tin nhắn thất bại:", error);
      setSendError(error.message || "Không thể gửi tin nhắn.");
    } finally {
      setIsSending(false);
    }
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!API_KEY) {
      setAiError("Thiếu API Key cho OpenRouter.");
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    const messageTypeText =
      document.getElementById("messageType")?.selectedOptions[0]?.text;
    const targetRoleText =
      document.getElementById("targetRole")?.selectedOptions[0]?.text;
    const recipientText =
      document.getElementById("targetRecipient")?.selectedOptions[0]?.text;
    const targetDescription = recipientText || targetRoleText;

    const systemPrompt = `Bạn là trợ lý ảo của hệ thống trường trung học cơ sở.
    Soạn tin nhắn thông báo ngắn gọn, trang trọng bằng tiếng Việt.
    Không thêm lời chào, dấu đặc biệt hoặc ký hiệu.`;

    const userPrompt = `Loại thông báo: "${messageTypeText}"
    Người nhận: "${targetDescription}"
    Hãy viết nội dung tin nhắn tối thiểu 15 từ, rõ ràng và lịch sự.`;

    try {
      const response = await fetch(MODEL_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
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

      const result = await response.json();
      const generatedText = result?.choices?.[0]?.message?.content || "";
      setCustomMessage(generatedText.replace(/<s>|<\/s>|\[.*?\]/g, "").trim());
    } catch (err) {
      console.error("Lỗi AI:", err);
      setAiError("Không thể tạo nội dung tự động.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!token) return alert("Bạn chưa đăng nhập!");
    if (!window.confirm("Bạn có chắc muốn xóa tin nhắn này không?")) return;
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const res = await UserService.deleteMessage(userId, messageId);
      if (res?.success) {
        alert("Xóa tin nhắn thành công!");
        setHistoryMessage((prev) =>
          prev.filter((msg) => msg._id !== messageId)
        );
      } else {
        alert(res?.message || "Không thể xóa tin nhắn!");
      }
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Có lỗi xảy ra khi xóa tin nhắn.");
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
              historyMessage.map((item, idx) => (
                <li key={idx} className={cx("history-item")}>
                  <div className={cx("item-header")}>
                    <strong>[{item.messageType}]</strong>
                    <span className={cx("item-date")}>
                      {new Date(item.sentAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className={cx("item-body")}>{item.content}</div>
                  {item.image && (
                    <div className={cx("image-wrapper")}>
                      <img
                        src={item.image}
                        alt="Report"
                        className={cx("message-image")}
                        onClick={() => window.open(item.image, "_blank")}
                      />
                    </div>
                  )}
                  <div className={cx("item-footer")}>
                    <button
                      className={cx("delete-btn")}
                      onClick={() => handleDeleteMessage(item._id)}
                    >
                      &times; Xóa
                    </button>
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
                <option value="">-- Chọn loại thông báo --</option>
                <option value="student_on_bus">Học sinh đã lên xe</option>
                <option value="student_off_bus">Học sinh đã xuống xe</option>
                <option value="bus_delayed">Xe buýt bị trễ</option>
                <option value="bus_arrived">Xe buýt đã đến</option>
                <option value="general_announcement">Thông báo chung</option>
              </select>
            </div>

            <div className={cx("form-group")}>
              <label htmlFor="targetRole">Gửi đến</label>
              <select
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              >
                <option value="">-- Chọn đối tượng --</option>
                <option value="parent">Phụ huynh</option>
                <option value="driver">Tài xế</option>
                <option value="all_parents">Tất cả phụ huynh</option>
                <option value="all_drivers">Tất cả tài xế</option>
              </select>
            </div>

            {(targetRole === "parent" || targetRole === "driver") &&
              recipientList.length > 0 && (
                <div className={cx("form-group")}>
                  <label htmlFor="targetRecipient">Người nhận cụ thể</label>
                  <select
                    id="targetRecipient"
                    value={targetRecipient}
                    onChange={(e) => setTargetRecipient(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn người nhận --</option>
                    {recipientList.map((r) => {
                      let label = r.fullName;
                      if (r.role === "parent" && r.parentInfo?.children?.length)
                        label += ` (Phụ huynh em ${r.parentInfo.children
                          .map((c) => c.name)
                          .join(", ")})`;
                      if (r.role === "driver" && r.driverInfo?.driverNumber)
                        label += ` (Mã TX: ${r.driverInfo.driverNumber})`;
                      return (
                        <option key={r._id} value={r._id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

            <div className={cx("form-group")}>
              <label>Nội dung tin nhắn</label>
              <button
                type="button"
                className={cx("ai-btn")}
                onClick={handleAiGenerate}
                disabled={isAiLoading || !API_KEY}
              >
                {isAiLoading ? "Đang tạo..." : "Tạo nội dung tự động (AI)"}
              </button>
              {aiError && <span className={cx("error-text")}>{aiError}</span>}
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Nhập nội dung tin nhắn hoặc dùng AI để gợi ý..."
                rows={5}
                required
              />
            </div>

            {sendError && <span className={cx("error-text")}>{sendError}</span>}

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
