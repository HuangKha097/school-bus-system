import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/ReportTab.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import * as UserService from "../../service/UserService.js";

const cx = classNames.bind(styles);

const ReportTab = ({ buses }) => {
    const [form, setForm] = useState({
        bus: "",
        type: "",
        note: "",
        image: null,
    });
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, image: reader.result })); // base64
            };
            reader.readAsDataURL(file);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.image)
            return toast.error("Bạn phải đính kèm hình ảnh minh chứng!");

        try {
            setIsSending(true);

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Chưa đăng nhập!");

            const decoded = jwtDecode(token);
            const senderId = decoded.userId;

            const reportData = {
                senderId,
                bus: form.bus,
                type: form.type,
                note: form.note,
                image: form.image, // base64
            };

            const res = await UserService.sendReport(reportData);

            if (res.success) {
                toast.success("Báo cáo đã được gửi thành công!");
                setForm({ bus: "", type: "", note: "", image: null });
            } else {
                toast.error(res.message || "Không thể gửi báo cáo.");
            }
        } catch (error) {
            console.error("Lỗi gửi báo cáo:", error);
            toast.error("Gửi báo cáo thất bại. Vui lòng thử lại!");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className={cx("report-wrapper")}>
                <h2>Báo cáo chuyến đi</h2>
                <form onSubmit={handleSubmit} className={cx("form")}>
                    <label>
                        Chọn xe
                        <select
                            name="bus"
                            value={form.bus}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn xe --</option>
                            {buses?.map((bus) => (
                                <option key={bus._id} value={bus.busNumber}>
                                    {bus.busNumber}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Loại báo cáo
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn loại --</option>
                            <option value="delay">Trễ giờ</option>
                            <option value="absence">Học sinh vắng</option>
                            <option value="incident">Sự cố xe</option>
                            <option value="other">Khác</option>
                        </select>
                    </label>

                    <label>
                        Ghi chú chi tiết
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Nhập nội dung báo cáo..."
                            rows={5}
                            required
                        />
                    </label>

                    <label>
                        Hình ảnh minh chứng (bắt buộc)
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            required
                        />
                    </label>

                    {form.image && (
                        <div className={cx("preview")}>
                            <img
                                src={form.image}
                                alt="Preview"
                                className={cx("preview-img")}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={cx("btn-submit")}
                        disabled={isSending}
                    >
                        {isSending ? "Đang gửi..." : "Gửi báo cáo"}
                    </button>
                </form>
            </div>
            <Toaster position="top-right" />
        </>
    );
};

export default ReportTab;
