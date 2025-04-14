import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

const API_URL = process.env.REACT_APP_API_URL;

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    const orders = this.state.orders.map((item) => (
      <tr key={item._id} onClick={() => this.trItemClick(item)} style={{ cursor: 'pointer' }}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.customer.phone}</td>
        <td>{item.customer.address}</td>
        <td>{item.total}</td>
        <td><span>{item.status}</span></td>
      </tr>
    ));

    return (
      <div className="container d-flex flex-column form-profile-top align-items-stretch vh-100">
        <h2 className="text-center mb-4">ORDER LIST</h2>
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead  className="table">
              <tr>
                <th id="tb-or-lt">ID</th>
                <th id="tb-or-lt">Creation Date</th>
                <th id="tb-or-lt">Customer Name</th>
                <th id="tb-or-lt">Phone</th>
                <th id="tb-or-lt">Address</th>
                <th id="tb-or-lt">Total</th>
                <th id="tb-or-lt">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders}
            </tbody>
          </table>
        </div>
        {this.state.order && this.renderOrderDetails()}
      </div>
    );
  }

  renderOrderDetails() {
    const { order } = this.state;
    return (
      <div className="card mt-4">
        <div id="tb-or-lt" className="card-header">
          <h4 className="mb-0">ORDER DETAIL</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped text-center">
              <thead className="table">
                <tr>
                  <th id="hd-cl">#</th>
                  <th id="hd-cl">Product ID</th>
                  <th id="hd-cl">Name</th>
                  <th id="hd-cl"v>Image</th>
                  <th id="hd-cl">Price</th>
                  <th id="hd-cl">Quantity</th>
                  <th id="hd-cl">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.product._id}>
                    <td>{index + 1}</td>
                    <td>{item.product._id}</td>
                    <td>{item.product.name}</td>
                    <td><img src={`data:image/jpg;base64,${item.product.image}`} alt="Product" className="img-thumbnail" /></td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`${API_URL}/api/customer/orders/customer/` + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Myorders;