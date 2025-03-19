import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
    };
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/products?page=${page}`, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage
      });
    });
  }

  renderPagination() {
    const { noPages, curPage } = this.state;
    if (noPages <= 1) return null;

    let startPage = Math.max(1, curPage - 1);
    let endPage = Math.min(noPages, startPage + 3);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${i === curPage ? 'btn-primary' : 'btn-light'}`}
          onClick={() => this.lnkPageClick(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="d-flex align-items-center justify-content-center mt-3">
        <button
          className="btn btn-sm btn-light mx-1"
          disabled={curPage === 1}
          onClick={() => this.lnkPageClick(curPage - 1)}
        >
          Previous
        </button>
        {pages}
        <button
          className="btn btn-sm btn-light mx-1"
          disabled={curPage === noPages}
          onClick={() => this.lnkPageClick(curPage + 1)}
        >
          Next
        </button>
      </div>
    );
  }

  render() {
    const prods = this.state.products.map((item) => (
      <tr key={item._id} className="table-row cursor-pointer" onClick={() => this.trItemClick(item)}>
        <td>{item._id}</td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.category.name}</td>
        <td>
          <img src={`data:image/jpg;base64,${item.image}`} className="img-thumbnail" width="100px" height="100px" alt="Product" />
        </td>
      </tr>
    ));

    return (
      <div className="container mt-4 content">
        <div className="row">
          {/* Bảng danh sách sản phẩm */}
          <div className="col-md-8">
            <h2 className="text-center">Product List</h2>
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Creation Date</th>
                  <th>Category</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {prods}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-center">{this.renderPagination()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="col-md-4">
            <ProductDetail
              item={this.state.itemSelected}
              curPage={this.state.curPage}
              updateProducts={this.updateProducts}
            />
          </div>
        </div>
      </div>
    );
  }

  updateProducts = (products, noPages) => {
    this.setState({ products: products, noPages: noPages });
  }
}

export default Product;
