import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const UpdatePassComponent = () => {
      const { token } = useParams();
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
                  setError("Mật khẩu không khớp!");
                  return;
            }

            try {
                  const response = await axios.post(`${API_URL}/api/customer/reset-password`, {
                        token,
                        newPassword
                  });

                  setMessage(response.data.message);
                  setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                  setError(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!");
            }
      };

      return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                  <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                        <h3 className="text-center mb-4">Đặt lại mật khẩu</h3>
                        <form onSubmit={handleSubmit}>
                              <div className="mb-3">
                                    <label className="form-label">Mật khẩu mới</label>
                                    <input
                                          type="password"
                                          className="form-control"
                                          placeholder="Nhập mật khẩu mới"
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          required
                                    />
                              </div>
                              <div className="mb-3">
                                    <label className="form-label">Xác nhận mật khẩu</label>
                                    <input
                                          type="password"
                                          className="form-control"
                                          placeholder="Nhập lại mật khẩu"
                                          value={confirmPassword}
                                          onChange={(e) => setConfirmPassword(e.target.value)}
                                          required
                                    />
                              </div>
                              <button type="submit" className="btn btn-primary w-100">Đặt lại mật khẩu</button>
                        </form>

                        {message && <div className="alert alert-success mt-3">{message}</div>}
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                  </div>
            </div>
      );
};

export default UpdatePassComponent;
