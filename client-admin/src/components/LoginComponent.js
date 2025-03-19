import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

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

  apiLogin = (account) => {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        this.setState({ errorMessage: result.message });
      }
    });
  };

  render() {
    if (this.context.token === '') {
      return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="text-center text-primary">ADMIN LOGIN</h2>

                {/* Hiển thị lỗi nếu có */}
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

                  <button className="btn btn-primary w-100" onClick={this.btnLoginClick}>
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
