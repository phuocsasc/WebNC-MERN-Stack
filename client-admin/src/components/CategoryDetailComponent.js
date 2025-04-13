import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

// 👉 Lấy API_URL từ biến môi trường
const API_URL = process.env.REACT_APP_API_URL;

class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }
  render() {
    return (
      <div className="card rounded shadow-sm mt-3 p-3 ">
        <h3 className="text-center" id="title-category-detail">CATEGORY DETAIL</h3>

        <form >
          <div className="mb-3">
            <label className="form-label">ID</label>
            <input
              type="text"
              className="form-control"
              value={this.state.txtID}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={this.state.txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-around">
            <button className="btn" id="button-click-categories" onClick={(e) => this.btnAddClick(e)}>
                <i className="fas fa-plus"></i> ADD NEW</button>
            <button className="btn" id="button-click-categories" onClick={(e) => this.btnUpdateClick(e)}>
                <i className="fas fa-edit"></i> UPDATE</button>
            <button className="btn" id="button-click-categories" onClick={(e) => this.btnDeleteClick(e)}>
                <i className="fas fa-trash"></i> DELETE</button>
</div>

        </form>
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
  // event-handlers
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert('Please input name');
    }
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please input id and name');
    }
  }
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert('Please input id');
      }
    }
  }
  // apis
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post(`${API_URL}/api/admin/categories`, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetCategories();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`${API_URL}/api/admin/categories/` + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetCategories();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`${API_URL}/api/admin/categories/` + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Good job!');
        this.apiGetCategories();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`${API_URL}/api/admin/categories`, config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
}
export default CategoryDetail;