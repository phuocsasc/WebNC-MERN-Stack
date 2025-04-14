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
                <Link to='/login' id="hd-cl" className="btn">Login</Link> 
                <span className="text-muted">|</span>
                <Link to='/signup' id="hd-cl" className="btn">Sign-up</Link> 
                <span className="text-muted">|</span>
                <Link to='/active' id="hd-cl" className="btn">Active</Link>
              </div>
            ) : (
              <div>
                  <span id="hd-cl" className="me-3">👋 Hello <b>{this.context.customer.name}</b></span> 
                  <span className="text-muted">|</span>
                  <Link to='/mycart' className="btn" id="hd-cl">
                    My Cart <span className="badge bg-danger ms-1">{this.context.mycart.length}</span>
                  </Link>
                  <span className="text-muted">|</span>
                  <Link to='/myorders' className="btn" id="hd-cl">My orders</Link>
                  <span className="text-muted">|</span>
                  <Link to='/myprofile' className="btn" id="hd-cl">My profile</Link> 
                  <span className="text-muted">|</span>
                  <Link to='/home' className="btn" id="hd-cl" onClick={() => this.lnkLogoutClick()}>Logout</Link> 
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