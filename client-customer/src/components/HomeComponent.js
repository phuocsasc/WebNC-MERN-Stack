import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaStar } from 'react-icons/fa';
import imgSrc from '../imgs/banner-thoi-trang.jpg';
import '../styles/HomeComponent.css';
// npm install react-icons@4.7.1

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
        <div className="flex justify-center">
          <img src={imgSrc} className="w-full max-w-4xl rounded-lg shadow-lg hover:scale-105 transition duration-500" alt="Shop Banner" />
        </div>

        {/* 🆕 NEW PRODUCTS */}
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase flex items-center justify-center gap-2">
            <FaStar className="text-yellow-500" /> New Products
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {this.state.newprods && this.state.newprods.map((item) => (
            item && item._id ? (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                <Link to={`/product/${item._id}`}>
                  <img src={`data:image/jpg;base64,${item.image}`} className="w-full h-60 object-cover rounded-lg" alt={item.name} />
                </Link>
                <div className="text-center mt-4">
                  <h5 className="text-lg font-semibold">{item.name}</h5>
                  <p className="text-red-500 font-bold">Price: ${item.price}</p>
                  <Link to={`/product/${item._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Details</Link>
                </div>
              </div>
            ) : null
          ))}
        </div>

        {/* 🔥 HOT PRODUCTS */}
        {this.state.hotprods && this.state.hotprods.length > 0 && (
          <div>
            <div className="text-center mt-3">
              <h2 className="text-3xl font-bold uppercase text-red-500 flex items-center justify-center gap-2">
                <FaFire className="text-orange-500" /> Hot Products
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {this.state.hotprods.map((item) => (
                item && item._id ? (
                  <div key={item._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                    <Link to={`/product/${item._id}`}>
                      <img src={`data:image/jpg;base64,${item.image}`} className="w-full h-60 object-cover rounded-lg" alt={item.name} />
                    </Link>
                    <div className="text-center mt-4">
                      <h5 className="text-lg font-semibold">{item.name}</h5>
                      <p className="text-red-500 font-bold">Price: ${item.price}</p>
                      <Link to={`/product/${item._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Details</Link>
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
    axios.get('/api/customer/products/new')
      .then((res) => {
        this.setState({ newprods: res.data || [] });
      })
      .catch((err) => {
        console.error('Error fetching new products:', err);
        this.setState({ newprods: [] });
      });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot')
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
