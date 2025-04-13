import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import { Link } from 'react-router-dom';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ width: '400px' }}>
          <h2 id="hd-cl" className="text-center mb-4">CUSTOMER LOGIN</h2>
          <form>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.txtUsername}
                onChange={(e) => this.setState({ txtUsername: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={this.state.txtPassword}
                onChange={(e) => this.setState({ txtPassword: e.target.value })}
              />
            </div>

            {/* Login Button */}
            <div className="d-grid">
              <button
                id="bt-cl"
                className="btn btn-primary"
                type="submit"
                onClick={(e) => this.btnLoginClick(e)}
              >
                LOGIN
              </button>
            </div>
          </form>

          {/* Forgot Password & Sign Up Links */}
          <div  className="text-center mt-3">
            <Link to='/forgotpassword' id="hd-cl" className="text-decoration-none">Forgot Password?</Link>
          </div>
        </div>
      </div>
    );
  }

  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: txtPassword };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  // API login
  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);
