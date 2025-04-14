import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaStar } from 'react-icons/fa';
// import imgSrc from '../imgs/banner-thoi-trang.png';
import '../styles/HomeComponent.css';
// npm install react-icons@4.7.1

const API_URL = process.env.REACT_APP_API_URL;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }

  render() {
    return (
      <div className="container mx-auto container-important">
        {/* 🖼 Banner */}

        <div id="bannerCarousel" className="carousel slide mb-8" data-bs-ride="carousel" data-bs-interval="1500">
        <div className="carousel-inner rounded-lg shadow-lg">
          <div className="carousel-item active" data-bs-interval="2000">
            <img src="valafashionbanner2.png" className="d-block w-100" alt="Banner1" />
          </div>
          <div className="carousel-item active" data-bs-interval="2000">
            <img src="valafashionbanner3.png" className="d-block w-100" alt="Banner3" />
          </div>
          <div className="carousel-item active" data-bs-interval="2000">
            <img src="valafashionbanner1.png" className="d-block w-100" alt="Banner2" />
          </div>
          <div cclassName="carousel-item active" data-bs-interval="2000">
            <img src="valafashionbanner2.png" className="d-block w-100" alt="Banner1" />
          </div>
        </div>

        {/* Nút điều hướng */}
        <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>


        {/* 🆕 NEW PRODUCTS */}
        <div className="text-center">
          <h2 id="hd-cl" className="text-3xl font-bold uppercase flex items-center justify-center gap-2">
            <FaStar className="text-yellow-500" /> New Products
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {this.state.newprods && this.state.newprods.map((item) => (
            item && item._id ? (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                <Link to={`/product/${item._id}`}>
                  <img src={`data:image/jpg;base64,${item.image}`} className="w-full h-[240px] object-cover rounded-lg" alt={item.name} />
                </Link>
                <div className="text-center mt-4">
                  <h5 className="text-lg font-semibold">{item.name}</h5>
                  <p id="price-cl" className="text-500 font-bold">Price: ${item.price}</p>
                  <Link to={`/product/${item._id}`} id="bt-view-dt"  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Details</Link>
                </div>
              </div>
            ) : null
          ))}
        </div>
        {/* 🔥 HOT PRODUCTS */}
        {this.state.hotprods && this.state.hotprods.length > 0 && (
          <div>
            <div className="text-center mt-3">
              <h2 id="hd-cl" className="text-3xl font-bold uppercase text-red-500 flex items-center justify-center gap-2">
                <FaFire className="text-orange-500" /> HOT PRODUCTS
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {this.state.hotprods.map((item) => (
                item && item._id ? (
                  <div key={item._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                    <Link to={`/product/${item._id}`}>
                      <img src={`data:image/jpg;base64,${item.image}`} className="w-full h-[240px] object-cover rounded-lg" alt={item.name} />
                    </Link>
                    <div className="text-center mt-4">
                      <h5 className="text-lg font-semibold">{item.name}</h5>
                      <p id="price-cl" className="text-500 font-bold">Price: ${item.price}</p>
                      <Link to={`/product/${item._id}`} id="bt-view-dt" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Details</Link>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  apiGetNewProducts() {
    axios.get(`${API_URL}/api/customer/products/new`)
      .then((res) => {
        this.setState({ newprods: res.data || [] });
      })
      .catch((err) => {
        console.error('Error fetching new products:', err);
        this.setState({ newprods: [] });
      });
  }

  apiGetHotProducts() {
    axios.get(`${API_URL}/api/customer/products/hot`)
      .then((res) => {
        this.setState({ hotprods: res.data || [] });
      })
      .catch((err) => {
        console.error('Error fetching hot products:', err);
        this.setState({ hotprods: [] });
      });
  }
}

export default Home;
