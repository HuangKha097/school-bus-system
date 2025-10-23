import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/ReportTab.module.scss";
import toast, { Toaster } from "react-hot-toast";

const cx = classNames.bind(styles);

const ReportTab = () => {
    const [form, setForm] = useState({
        bus: "",
        type: "",
        note: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setForm((prev) => ({ ...prev, image: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.image)
            return toast.error("Bạn phải đính kèm hình ảnh minh chứng!");

        const reportData = {
            ...form,
            createdAt: new Date().toLocaleString(),
        };

        console.log("Report sent:", reportData);
        toast.success("Báo cáo đã được gửi thành công!");

        setForm({ bus: "", type: "", note: "", image: null });
        e.target.reset();
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
                            <option value="BUS001">BUS001</option>
                            <option value="BUS002">BUS002</option>
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
                                src={URL.createObjectURL(form.image)}
                                alt="Preview"
                                className={cx("preview-img")}
                            />
                        </div>
                    )}

                    <button type="submit" className={cx("btn-submit")}>
                        Gửi báo cáo
                    </button>
                </form>
            </div>
            <Toaster position="top-right" />
        </>
    );
};

export default ReportTab;
