
import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';
import { Navigate } from 'react-router-dom';
import { Table, Button, Image, Container, Alert, Form } from 'react-bootstrap';

class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <tr key={item.product._id}>
          <td>{index + 1}</td>
          <td>{item.product._id}</td>
          <td>{item.product.name}</td>
          <td>{item.product.category.name}</td>
          <td>
            <Image src={`data:image/jpg;base64,${item.product.image}`} width="70" height="70" rounded />
          </td>
          <td>${item.product.price.toFixed(2)}</td>
          <td>
            <Form.Control
              type="number"
              min="1"
              max="99"
              value={item.quantity}
              onChange={(e) => this.updateQuantity(item.product._id, e.target.value)}
            />
          </td>
          <td>${(item.product.price * item.quantity).toFixed(2)}</td>
          <td>
            <Button id="bt-cl" size="sm" onClick={() => this.lnkRemoveClick(item.product._id)}> <i className="fas fa-trash"></i> Remove
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <Container className="container d-flex flex-column form-profile-top align-items-center vh-100">
        <h2 id="hd-cl" className="text-center mb-4">SHOPPING CART</h2>
        {this.context.mycart.length === 0 ? (
          <Alert variant="warning" className="text-center">Your cart is empty!</Alert>
        ) : (
          <Table striped bordered hover responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th id="tb-or-lt">No.</th>
                <th id="tb-or-lt">ID</th>
                <th id="tb-or-lt">Name</th>
                <th id="tb-or-lt">Category</th>
                <th id="tb-or-lt">Image</th>
                <th id="tb-or-lt">Price</th>
                <th id="tb-or-lt">Quantity</th>
                <th id="tb-or-lt">Amount</th>
                <th id="tb-or-lt">Action</th>
              </tr>
            </thead>
            <tbody>
              {mycart}
              <tr>
                <td colSpan="6"></td>
                <td><strong>Total</strong></td>
                <td><strong>${CartUtil.getTotal(this.context.mycart).toFixed(2)}</strong></td>
                <td>
                    <Button id="bt-cl" onClick={() => this.lnkCheckoutClick()}><i class="fa-solid fa-credit-card"></i> Checkout
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </Container>
    );
  }
  // event-handlers
  updateQuantity = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity >= 1 && quantity <= 99) {
      const mycart = [...this.context.mycart];
      const index = mycart.findIndex(x => x.product._id === productId);
      if (index !== -1) {
        mycart[index].quantity = quantity;
        this.context.setMycart(mycart);
      }
    } else {
      alert("Quantity must be between 1 and 99.");
    }
  };

  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) { // found, remove item
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }
  lnkCheckoutClick() {
    if (window.confirm('ARE YOU SURE?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Your cart is empty');
      }
    }
  }
  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
}
export default withRouter(Mycart);
