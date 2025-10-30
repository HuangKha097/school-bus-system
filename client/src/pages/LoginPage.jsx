import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../assets/css/common/LoginPage.module.scss";
import * as UserService from "../service/UserService";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

const LoginPage = () => {
  const [formData, setFormData] = useState({ phone: "", password: "" });

  const fetchUser = async (values) => {
    try {
      const res = await UserService.login(values);
      console.log("Login success:", res);

      if (res?.success === true && res?.token) {
        localStorage.setItem("token", res.token);

        toast.success("Đăng nhập thành công!");

        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        toast.error("Sai tài khoản hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUser(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("card")}>
        <h2 className={cx("title")}>Đăng nhập</h2>
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

          <div>
            <label className={cx("label")}>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu..."
              className={cx("input")}
              value={formData.password}
              onChange={handleChange}
            />

            <div className={cx("forgotWrapper")}>
              <Link to={"/forgot-password"} className={cx("forgotLink")}>
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button type="submit" className={cx("button")}>
            Đăng nhập
          </button>
        </form>

        <span className={cx("hot-line")}>HotLine hỗ trợ: 0912345678</span>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginPage;
