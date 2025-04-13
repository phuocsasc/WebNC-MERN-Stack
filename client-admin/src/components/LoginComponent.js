import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

// 👉 Lấy API_URL từ biến môi trường
const API_URL = process.env.REACT_APP_API_URL;

class Login extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      errorMessage: '' // Lưu lỗi khi đăng nhập thất bại
    };
  }
// Nút bấm Login
  btnLoginClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: txtPassword };
      this.apiLogin(account);
    } else {
      this.setState({ errorMessage: 'Please enter both username and password' });
    }
  };

  // Gửi đi Username & Password từ form Login lên Database để kiểm tra
  apiLogin = (account) => {
    axios.post(`${API_URL}/api/admin/login`, account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        this.setState({ errorMessage: result.message });
      }
    }).catch((error) => {
      this.setState({ errorMessage: 'Login failed. Please try again later.' });
      console.error('Login error:', error);
    });
  };

  // Giao diện
  render() {
    if (this.context.token === '') {
      return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h2 id="hd-cl" className="text-center">ADMIN LOGIN</h2>

                {this.state.errorMessage && (
                  <div className="alert alert-danger text-center">{this.state.errorMessage}</div>
                )}

                <form>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter username"
                      value={this.state.txtUsername}
                      onChange={(e) => this.setState({ txtUsername: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={this.state.txtPassword}
                      onChange={(e) => this.setState({ txtPassword: e.target.value })}
                    />
                  </div>
                  <button id="bt-cl" className="btn w-100" onClick={this.btnLoginClick}>
                    LOGIN
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default Login;
