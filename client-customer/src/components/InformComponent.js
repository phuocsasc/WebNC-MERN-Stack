import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    return (
      <div className="container-fluid bg-light py-0 border-bottom fixed-top w-100 shadow">
        <div className="row align-items-center">
          {/* Cột bên trái: Thông tin đăng nhập */}
          <div className="col-md-12 text-start">
            {this.context.token === '' ? (
              <div>
                <Link to='/login' className="btn">Login</Link> 
                <span className="text-muted">|</span>
                <Link to='/signup' className="btn">Sign-up</Link> 
                <span className="text-muted">|</span>
                <Link to='/active' className="btn">Active</Link>
              </div>
            ) : (
              <div>
                  <span className="me-3">👋 Hello <b>{this.context.customer.name}</b></span> 
                  <span className="text-muted">|</span>
                  <Link to='/home' className="btn" onClick={() => this.lnkLogoutClick()}>Logout</Link> 
                  <span className="text-muted">|</span>
                  <Link to='/myprofile' className="btn">My profile</Link> 
                  <span className="text-muted">|</span>
                  <Link to='/myorders' className="btn">My orders</Link>
                  <span className="text-muted">|</span>
                  <Link to='/mycart' className="btn ">
                    My Cart <span className="badge bg-danger ms-1">{this.context.mycart.length}</span>
                  </Link>
              </div>
            )}
          </div>

        
        </div>
      </div>
    );
  }

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default Inform;
