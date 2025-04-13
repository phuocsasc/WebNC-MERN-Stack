import axios from 'axios';
import React, { Component } from 'react';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtAddress: '',
      txtEmail: ''
    };
  }
  render() {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100 form-top">
        <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 id="hd-cl" className="text-center mb-4">CUSTOMER SIGN UP</h2>
          <form onSubmit={(e) => this.btnSignupClick(e)}>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" placeholder="Username" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} required />
              <label>Username</label>
            </div>
            <div className="form-floating mb-3">
              <input type="password" className="form-control" placeholder="Password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} required />
              <label>Password</label>
            </div>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" placeholder="Full Name" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} required />
              <label>Full Name</label>
            </div>
            <div className="form-floating mb-3">
              <input type="tel" className="form-control" placeholder="Phone" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} required />
              <label>Phone</label>
            </div>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" placeholder="Address" value={this.state.txtAddress} onChange={(e) => this.setState({ txtAddress: e.target.value })} required />
              <label>Address</label>
            </div>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" placeholder="Email" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} required />
              <label>Email</label>
            </div>
            <button id="bt-cl" type="submit" className="btn w-100">Sign Up</button>
          </form>
        </div>
      </div>
    );
  }
  // event-handlers
  btnSignupClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const address = this.state.txtAddress
    const email = this.state.txtEmail;
    if (username && password && name && phone && address && email) {
      const account = { username: username, password: password, name: name, phone: phone, address: address, email: email };
      this.apiSignup(account);
    } else {
      alert('Please input username and password and name and phone and address and email');
    }
  }
  // apis
  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }
}
export default Signup;