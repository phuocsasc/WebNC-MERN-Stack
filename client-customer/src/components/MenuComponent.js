import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import imgSrc from '../imgs/logo.png';
// import '../styles/Menu.css'; // Thêm file CSS để quản lý hiệu ứng

class Menu extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  categories: [],
                  txtKeyword: '',
                  activeCategory: '' // Lưu danh mục đang được chọn
            };
      }

      // Xử lý click vào danh mục
      handleCategoryClick(categoryId) {
            this.setState({ activeCategory: categoryId });
      }

      render() {
            const cates = this.state.categories.map((item) => (
                  <li key={item._id} className="nav-item">
                        <Link
                              to={`/product/category/${item._id}`}
                              className={`nav-link ${this.state.activeCategory === item._id ? 'active' : ''}`}
                              onClick={() => this.handleCategoryClick(item._id)}
                        >
                              {item.name}
                        </Link>
                  </li>
            ));

            return (
                  <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100">
                        <div className="container-fluid">
                              {/* Logo */}
                              <Link to="/home" className="navbar-brand">
                                    <img src={imgSrc} alt="Logo" className="me-3 logo" />
                              </Link>

                              {/* Toggle button cho mobile */}
                              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                    <span className="navbar-toggler-icon"></span>
                              </button>

                              {/* Menu items */}
                              <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav">
                                          <li className="nav-item">
                                                <Link
                                                      to="/"
                                                      className={`nav-link ${this.state.activeCategory === 'home' ? 'active' : ''}`}
                                                      onClick={() => this.handleCategoryClick('home')}
                                                >
                                                      Home
                                                </Link>
                                          </li>
                                          {cates}
                                    </ul>

                                    {/* Search bar */}
                                    <form className="d-flex ms-auto">
                                          <input
                                                type="search"
                                                placeholder="Enter keyword"
                                                className="form-control me-2"
                                                value={this.state.txtKeyword}
                                                onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                                          />
                                          <button
                                                className="btn btn-outline-success"
                                                type="submit"
                                                onClick={(e) => this.btnSearchClick(e)}
                                          >
                                                SEARCH
                                          </button>
                                    </form>
                              </div>
                        </div>
                  </nav>
            );
      }

      // Xử lý sự kiện tìm kiếm
      btnSearchClick(e) {
            e.preventDefault();
            this.props.navigate('/product/search/' + this.state.txtKeyword);
      }

      componentDidMount() {
            this.apiGetCategories();
      }

      // API lấy danh mục sản phẩm
      apiGetCategories() {
            axios.get('/api/customer/categories').then((res) => {
                  const result = res.data;
                  this.setState({ categories: result });
            });
      }
}

export default withRouter(Menu);
