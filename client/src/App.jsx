import React, { useState, useEffect } from "react";
import ManagerPage from "./pages/ManagerPage";
import ParentPage from "./pages/ParentPage";
import DriverPage from "./pages/DriverPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { jwtDecode } from "jwt-decode";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
    const [role, setRole] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true); // trạng thái chờoo

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded);

                setRole(decoded?.role);
                setUserName(decoded?.userName);
                setUserId(decoded?.userId);
            } catch (err) {
                console.error("Token không hợp lệ:", err.message);
                localStorage.removeItem("token");
                setRole("");
            }
        } else {
            setRole("");
        }
        setLoading(false); // chỉ render route sau khi đã kiểm tra xong
    }, [token]);

    if (loading) return null;

    return (
        <Routes>
            {!token ? (
                <>
                    <Route
                        path="/login"
                        element={<LoginPage setRole={setRole} />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </>
            ) : (
                <>
                    <Route
                        path="/login"
                        element={<Navigate to="/" replace />}
                    />

                    {role === "manager" && (
                        <Route
                            path="/*"
                            element={
                                <ManagerPage
                                    role={role}
                                    setRole={setRole}
                                    userName={userName}
                                />
                            }
                        />
                    )}
                    {role === "parent" && (
                        <Route
                            path="/*"
                            element={
                                <ParentPage
                                    role={role}
                                    setRole={setRole}
                                    userName={userName}
                                    userId={userId}
                                />
                            }
                        />
                    )}
                    {role === "driver" && (
                        <Route
                            path="/*"
                            element={
                                <DriverPage
                                    role={role}
                                    setRole={setRole}
                                    userName={userName}
                                    userId={userId}
                                />
                            }
                        />
                    )}

                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
}

export default App;
