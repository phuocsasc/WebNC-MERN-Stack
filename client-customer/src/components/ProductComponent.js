import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) { // hàm khởi tạo của component, đang nhận props từ bên ngoài.
    super(props); // Kế thừa constructor của React.Component. Cho phép ta sử dụng this.props
    this.state = { // Khởi tạo state là nơi lưu dữ liệu nội bộ của component, với một mảng products rỗng.
      products: []
    };
  }
  render() {
    const prods = this.state.products.map((item) => { // lấy danh sách sản phẩm từ state. map qua từng sản phẩm
      return ( // React yêu cầu mỗi phần tử trong list phải có key duy nhất để tối ưu render lại.
        <div key={item._id} className="col-md-4 mb-4"> 
          <div className="card h-100 shadow-sm">
            <Link to={'/product/' + item._id}>
              <img src={"data:image/jpg;base64," + item.image} className="card-img-top" alt={item.name} />
            </Link>
            <div className="card-body text-center">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text text-danger fw-bold">Price: ${item.price}</p>
              <Link to={'/product/' + item._id} className="btn btn-primary">View Details</Link>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="container form-product-top">
        <h2 className="text-center my-4">Product List</h2>
        <div className="row">
          {prods.length > 0 ? prods : <p className="text-center">No products available</p>}
        </div>
      </div>
    );
  }
  componentDidMount() { // first: /product/...
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  componentDidUpdate(prevProps) { // changed: /product/...
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
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