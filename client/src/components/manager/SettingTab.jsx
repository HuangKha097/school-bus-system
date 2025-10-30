import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/css/common/SettingTab.module.scss";

import vieFlag from "../../assets/vietnam.svg";
import usaFlag from "../../assets/united-kingdom.svg";
const cx = classNames.bind(styles);

export default function SettingsTab() {
    const [appearance, setAppearance] = useState({
        theme: "light",
        language: "vi",
    });

    const handleSave = async () => {
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
                            className={cx(
                                "pill",
                                appearance.theme === "light" && "active"
                            )}
                            onClick={() =>
                                setAppearance({ ...appearance, theme: "light" })
                            }
                        >
                            Sáng
                        </button>
                        <button
                            className={cx(
                                "pill",
                                appearance.theme === "dark" && "active"
                            )}
                            onClick={() =>
                                setAppearance({ ...appearance, theme: "dark" })
                            }
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

                    <div className={cx("select-language")}>
                        <div>
                            <button
                                className={cx(
                                    "flag",
                                    appearance.language === "eng" && "active"
                                )}
                                onClick={() =>
                                    setAppearance({
                                        ...appearance,
                                        language: "eng",
                                    })
                                }
                            >
                                <img src={vieFlag} alt="Vietnam flag" />
                                <span className={cx("flag-title")}>
                                    Vietnamese
                                </span>
                            </button>
                        </div>
                        <div>
                            <button
                                className={cx(
                                    "flag",
                                    appearance.language === "vi" && "active"
                                )}
                                onClick={() =>
                                    setAppearance({
                                        ...appearance,
                                        language: "vi",
                                    })
                                }
                            >
                                <img src={usaFlag} alt="US/UK flag" />
                                <span className={cx("flag-title")}>
                                    English
                                </span>
                            </button>
                        </div>
                    </div>
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
