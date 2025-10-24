import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/LoginPage.module.scss";
import * as UserService from "../service/UserService";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const ForgotPasswordPage = () => {
    const [formData, setFormData] = useState({ phone: "" });

    const handleForgotPassword = async (values) => {
        try {
            console.log("Forgot password for:", values);

            toast.success(
                "Nếu số điện thoại tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu."
            );
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleForgotPassword(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className={cx("wrapper")}>
            <div className={cx("card")}>
                <h2 className={cx("title")}>Quên mật khẩu</h2>

                <p className={cx("subtitle")}>
                    Nhập số điện thoại của bạn để nhận hướng dẫn.
                </p>

                <form className={cx("form")} onSubmit={handleSubmit}>
                    <div>
                        <label className={cx("label")}>Số điện thoại</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Nhập số điện thoại..."
                            className={cx("input")}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className={cx("button")}>
                        Gửi hướng dẫn
                    </button>

                    <div className={cx("forgotWrapper")}>
                        <Link to={"/login"} className={cx("forgotLink")}>
                            Quay lại Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default ForgotPasswordPage;
