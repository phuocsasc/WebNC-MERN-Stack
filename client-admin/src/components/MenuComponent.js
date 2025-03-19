import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import imgSrc from '../imgs/logo.png';

class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100 shadow">
          <div className="container-fluid">
            {/* Brand Logo */}
            <Link className="navbar-brand" to="/admin/home">
              <img src={imgSrc} alt="Logo" width="150" height="auto" className="me-6" />
            </Link>

            {/* Toggle button cho mobile */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menu items */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/home">🏠 Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/category">📂 Category</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/product">📦 Product</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/order">🛒 Order</Link>  
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/customer">👥 Customer</Link> 
                </li>
              </ul>

              {/* User Info & Logout */}
              <ul className="navbar-nav ms-auto d-flex align-items-center">
                <li className="nav-item me-3">
                  <span className="navbar-text">👋 Hello, <b>{this.context.username}</b></span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-danger d-flex align-items-center" to="/admin/home" onClick={this.lnkLogoutClick}>
                    <i className="bi bi-box-arrow-right"></i> &nbsp;
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;
