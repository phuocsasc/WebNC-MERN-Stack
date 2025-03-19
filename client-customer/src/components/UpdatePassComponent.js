import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePassComponent = () => {
      const { token } = useParams(); // ✅ Lấy token từ URL
      const navigate = useNavigate();

      const [newPassword, setNewPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [message, setMessage] = useState("");
      const [error, setError] = useState("");

      const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage("");
            setError("");

            if (newPassword !== confirmPassword) {
                  setError("Mật khẩu không khớp! update");
                  return;
            }

            try {
                  console.log("Token gửi đi update:", token); // 🛠 Debug token

                  const response = await axios.post("/api/customer/reset-password", {
                        token,
                        newPassword
                  });

                  setMessage(response.data.message);
                  setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                  setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại! update");
            }
      };

      return (
            <div className="reset-password-container">
                  <h2>Đặt lại mật khẩu</h2>
                  <form onSubmit={handleSubmit}>
                        <input
                              type="password"
                              placeholder="Mật khẩu mới"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                        />
                        <input
                              type="password"
                              placeholder="Xác nhận mật khẩu"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                        />
                        <button type="submit">Đặt lại mật khẩu</button>
                  </form>
                  {message && <p className="success-message">{message}</p>}
                  {error && <p className="error-message">{error}</p>}
            </div>
      );
};

export default UpdatePassComponent;
