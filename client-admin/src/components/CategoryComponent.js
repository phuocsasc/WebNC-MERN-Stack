import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }
  render() {
    return (
      <div className="container mt-4 content">
        <h2 className="text-center mb-4">CATEGORY MANAGEMENT</h2>

        {/* Chi tiết danh mục */}
        <div className="row mb-3">
          <div className="col-md-12 offset-md-12">
            <div className="category-detail p-4 border rounded shadow">
              <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
            </div>
          </div>
        </div>

        {/* Danh sách danh mục */}
        <div className="row">
          <div className="col-md-12 offset-md-12">
            <div className="category-table p-3 border rounded shadow">
              <table className="table table-bordered table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.categories.map((item) => (
                    <tr key={item._id} onClick={() => this.trItemClick(item)} className="cursor-pointer">
                      <td>{item._id}</td>
                      <td>{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  updateCategories = (categories) => { // arrow-function
    this.setState({ categories: categories });
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default Category;