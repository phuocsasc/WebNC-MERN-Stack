import axios from 'axios';
import React, { Component } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: ''
    };
  }
  render() {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: '400px' }}>
          <h2 className="text-center mb-4">Active Account</h2>
          <form>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingID"
                placeholder="ID"
                value={this.state.txtID}
                onChange={(e) => this.setState({ txtID: e.target.value })}
              />
              <label htmlFor="floatingID">ID</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingToken"
                placeholder="Token"
                value={this.state.txtToken}
                onChange={(e) => this.setState({ txtToken: e.target.value })}
              />
              <label htmlFor="floatingToken">Token</label>
            </div>

            <button
              id="bt-cl"
              type="submit"
              className="btn btn-primary w-100"
              onClick={(e) => this.btnActiveClick(e)}
            >
              Activate
            </button>
          </form>
        </div>
      </div>
    );
  }
  // event-handlers
  btnActiveClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const token = this.state.txtToken;
    if (id && token) {
      this.apiActive(id, token);
    } else {
      alert('Please input id and token');
    }
  }
  // apis
  apiActive(id, token) {
    const body = { id: id, token: token };
    axios.post(`${API_URL}/api/customer/active`, body).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
}
export default Active;