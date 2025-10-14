import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/common/SettingTab.module.scss";
const cx = classNames.bind(styles);

export default function SettingsTab() {
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "vi",
  });

  const handleSave = async () => {
    // Lưu setting vào localStorage hoặc API
    localStorage.setItem("appSettings", JSON.stringify(appearance));
    alert("Cài đặt đã được lưu!");
  };

  return (
    <div className={cx("settingsWrapper")}>
      <h2 className={cx("title")}>Cài đặt giao diện</h2>

      <section className={cx("card")}>
        <h3 className={cx("cardTitle")}>Chế độ hiển thị</h3>
        <div className={cx("formRow")}>
          <label>Giao diện</label>
          <div className={cx("btnGroup")}>
            <button
              className={cx("pill", appearance.theme === "light" && "active")}
              onClick={() => setAppearance({ ...appearance, theme: "light" })}
            >
              Sáng
            </button>
            <button
              className={cx("pill", appearance.theme === "dark" && "active")}
              onClick={() => setAppearance({ ...appearance, theme: "dark" })}
            >
              Tối
            </button>
          </div>
        </div>
      </section>

      <section className={cx("card")}>
        <h3 className={cx("cardTitle")}>Ngôn ngữ</h3>
        <div className={cx("formRow")}>
          <label>Chọn ngôn ngữ</label>
          <select
            className={cx("select-languge")}
            value={appearance.language}
            onChange={(e) =>
              setAppearance({ ...appearance, language: e.target.value })
            }
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>

      <div className={cx("actionRow")}>
        <button className={cx("saveBtn")} onClick={handleSave}>
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
