import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) { // props là đối tượng chứa các thuộc tính được truyền vào component từ cha
    super(props);
    this.state = {
      products: []
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <Link to={'/product/' + item._id}>
              <img src={"data:image/jpg;base64," + item.image} className="card-img-top" alt={item.name} />
            </Link>
            <div className="card-body text-center">
              <h5 className="card-title">{item.name}</h5>
              <p id="price-cl" className="card-text fw-bold">Price: ${item.price}</p>
              <Link to={'/product/' + item._id} id="bt-view-dt" className="btn">View Details</Link>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="container form-product-top">
        <h2 id="hd-cl" className="text-center my-4">PRODUCT LIST</h2>
        <div className="row">
          {prods.length > 0 ? prods : <p className="text-center">No products available</p>}
        </div>
      </div>
    );
  }
  componentDidMount() { // Chạy khi component vừa được gắn vào DOM
    const params = this.props.params; // component Product mới được tạo
    if (params.cid) { // kiểm tra URL có cid ko (category ID)
      this.apiGetProductsByCatID(params.cid); // gọi API lấy sản phẩm theo danh mục với ID đó
    } else if (params.keyword) { // kiểm tra URL có keyword ko
      this.apiGetProductsByKeyword(params.keyword); // gọi API tìm sản phẩm theo từ khóa.
    }
  }
  componentDidUpdate(prevProps) { // Chạy khi props thay đổi
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) { // So sánh params.cid mới và cũ phải khác nhau
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  // apis
  apiGetProductsByCatID(cid) { // Gửi request đến backend để lấy các sản phẩm theo category id.
    axios.get('/api/customer/products/category/' + cid).then((res) => { // Khi server trả về dữ liệu thành công, hàm then được gọi.
      const result = res.data; // Dữ liệu thực sự trả về từ server
      this.setState({ products: result });
    });
  }
  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
}
export default withRouter(Product);