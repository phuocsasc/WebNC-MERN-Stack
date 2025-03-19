import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext; // using this.context to access global state
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
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    return (
      <div className="container form-profile-top">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">My Profile</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-control" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" value={this.state.txtAddress} onChange={(e) => this.setState({ txtAddress: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} />
            </div>
            <div className="text-center">
              <button className="btn btn-primary" onClick={(e) => this.btnUpdateClick(e)}>Update</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtAddress: this.context.customer.address,
        txtEmail: this.context.customer.email
      });
    }
  }
  // event-handlers
  btnUpdateClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const address = this.state.txtAddress;
    const email = this.state.txtEmail;
    if (username && password && name && phone && address && email) {
      const customer = { username: username, password: password, name: name, phone: phone, address: address, email: email };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Please input username and password and name and phone and address and email');
    }
  }
  // apis
  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.context.setCustomer(result);
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
}
export default Myprofile;