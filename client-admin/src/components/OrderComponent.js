import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/order.css';


class Order extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }
// Giao diện order list trong admin, hiển thị danh sách đơn hàng
  render() {
    const orders = this.state.orders.map((item) => {
      return (
        <motion.tr
          key={item._id}
          className="border-b hover:bg-gray-100 transition cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => this.trItemClick(item)}
        >
          {/* bảng order list  */}
          <td className="p-4">{item._id}</td>
          <td className="p-4">{new Date(item.cdate).toLocaleString()}</td>
          <td className="p-4">{item.customer.name}</td>
          <td className="p-4">{item.customer.phone}</td>
          <td className="p-4">{item.total} $</td>
          <td className="p-4 flex items-center">
            {item.status === 'PENDING' ? 
            // Cài màu cho từng nút
            <Clock className="text-yellow-500" /> : item.status === 'APPROVED' ? 
            <CheckCircle className="text-green-500" /> : 
            <XCircle className="text-red-500" />}
            <span className="ml-2">{item.status}</span>
          </td>
          <td className="p-4">
            {/* Trạng thái đang chờ PENDING thì được chọn 1 trong 2 nút approve và Cancel */}
            {item.status === 'PENDING' && (
              <div className="flex gap-4">
                {/* nút approve - chấp nhận đơn hàng */}
                <button className="text-green-600 hover:text-green-800" onClick={() => this.lnkApproveClick(item._id)}>Approve</button>
                {/* nút Cancel - hủy đơn hàng*/}
                <button className="text-red-600 hover:text-red-800" onClick={() => this.lnkCancelClick(item._id)}>Cancel</button>
              </div>
            )}
          </td>
        </motion.tr>
      );
    });
// GIAO DIỆN BẢNG ORDER LIST
    return (
      <div className="p-6 bg-gray-100 min-h-screen content">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 id="hd-cl"className="text-2xl font-bold mb-4 text-center">ORDER LIST</h2>
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr className="bg-gray-200">
                <th id="order-list" className="p-4">ID</th>
                <th id="order-list" className="p-4">Creation Date</th>
                <th id="order-list" className="p-4">Customer Name</th>
                <th id="order-list" className="p-4">Phone</th>
                <th id="order-list" className="p-4">Total</th>
                <th id="order-list" className="p-4">Status</th>
                <th id="order-list" className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>{orders}</tbody>
          </table>
        </div>

        {this.state.order && (
          <motion.div
            className="bg-white p-8 mt-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Chi tiết đơn hàng */}
            <h2 id="hd-cl" className="text-3xl font-bold mb-6 text-center text-gray-700">ORDER DETAIL</h2>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <p><strong>Order ID:</strong> {this.state.order._id}</p>
              <p><strong>Customer:</strong> {this.state.order.customer.name} ({this.state.order.customer.phone})</p>
              <p><strong>Address:</strong> {this.state.order.customer.address} </p>
              <p><strong>Total:</strong> {this.state.order.total} $</p>
              <p><strong>Status:</strong> <span className={this.state.order.status === 'PENDING' ? 'text-yellow-500' : this.state.order.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}>{this.state.order.status}</span></p>
            </div>
            <table className="w-full border border-gray-300 rounded-lg text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-sm font-medium" id="order-list2">
                  <th className="p-4">#</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.state.order.items.map((item, index) => (
                  <tr
                    key={item.product._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-4 text-gray-700">{index + 1}</td>
                    <td className="p-4 text-gray-700">{item.product.name}</td>
                    <td className="p-4">
                      <img
                        src={`data:image/jpg;base64,${item.product.image}`}
                        className="w-20 h-20 rounded-lg object-cover shadow-md product-image"
                        alt="Product"
                      />
                    </td>
                    <td className="p-4 text-gray-700">{item.product.price} $</td>
                    <td className="p-4 text-gray-700">{item.quantity}</td>
                    <td className="p-4 text-gray-700 font-semibold">
                      {item.product.price * item.quantity} $
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 text-right">
              <button
                className="px-6 py-2 close-button"
                onClick={() => this.setState({ order: null })}
              >
                Close Detail
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }
// PHƯƠNG THỨC
  //Khi bấm vào sẽ hiển thị đơn hàng Oders
  componentDidMount() {
    this.apiGetOrders();
  }
  //Bấm vào từng đơn hàng thì nó sẽ hiển thị chi tiết đơn hàng
  trItemClick(item) {
    this.setState({ order: item });
  }
  //Bấm approve
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }
  //Bấm cancel
  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/orders/status/${id}`, body, config).then((res) => {
      if (res.data) {
        this.apiGetOrders();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
}

export default Order;
