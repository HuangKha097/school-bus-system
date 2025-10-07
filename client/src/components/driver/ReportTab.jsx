import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/driver/ReportTab.module.scss";

const cx = classNames.bind(styles);

const ReportTab = () => {
  const [form, setForm] = useState({
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

    if (!form.image) {
      alert("Bạn phải đính kèm hình ảnh minh chứng!");
      return;
    }

    console.log("Report sent:", form);
    alert("Báo cáo đã được gửi thành công!");

    // reset
    setForm({ type: "", note: "", image: null });
    e.target.reset();
  };

  return (
    <div className={cx("report-wrapper")}>
      <h2>Báo cáo chuyến đi</h2>
      <form onSubmit={handleSubmit} className={cx("form")}>
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

        <button type="submit" className={cx("btn-submit")}>
          Gửi báo cáo
        </button>
      </form>
    </div>
  );
};

export default ReportTab;
