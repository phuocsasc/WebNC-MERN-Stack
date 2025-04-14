import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Thêm

const API_URL = process.env.REACT_APP_API_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // 👈 Thêm


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`${API_URL}/api/customer/forgotpassword`, { email });
            const token = response.data.token;
            if (token) {
                // 👇 Redirect sang trang đổi mật khẩu kèm token
                navigate(`/reset-password/${token}`);
            } else {
                // Nếu không có token, fallback thông báo
                alert("Vui lòng kiểm tra email của bạn!");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-3">Quên mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nhập email của bạn</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Gửi yêu cầu</button>
                </form>
                {message && <p className="alert alert-success mt-3">{message}</p>}
                {error && <p className="alert alert-danger mt-3">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;