import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

//Khi bấm nút Product trên thanh Menu thì class này (có nghĩa là file ProductDetailComponent.js được hoạt động)
// sẽ được render lên giao diện cho admin thấy
class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
    };
  }

  componentDidMount() {
    this.apiGetCategories(); // <-- Gọi API khi component được render lần đầu
  }
	// Kiểm tra props.item có thay đổi không? Trong componentDidUpdate(prevProps)
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) { //Kiểm tra xem giá trị item từ props hiện tại (this.props.item) có khác với giá trị trước đó (prevProps.item) không.
      this.setState({ //Nếu khác nhau → props item đã thay đổi → cần cập nhật state.
        txtID: this.props.item._id, //Lấy _id của item.
        txtName: this.props.item.name, //Lấy name của item.
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: `data:image/jpg;base64,${this.props.item.image}`, //Tạo URL ảnh dạng base64 từ
      });
    }
  }

  previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  //Call API: /api/admin/categories → set state categories[]
  //Hàm apiGetCategories:
  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  };

  apiGetProducts = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/products?page=${this.props.curPage}`, config).then((res) => {
      if (res.data.products.length !== 0) {
        this.props.updateProducts(res.data.products, res.data.noPages);
      } else {
        axios.get(`/api/admin/products?page=${this.props.curPage - 1}`, config).then((res) => {
          this.props.updateProducts(res.data.products, res.data.noPages);
        });
      }
    });
  };

  apiPostProduct = (prod) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      alert(res.data ? 'Product added successfully!' : 'Failed to add product.');
      this.apiGetProducts();
    });
  };

  apiPutProduct = (id, prod) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/products/${id}`, prod, config).then((res) => {
      alert(res.data ? 'OK BABY!' : 'SORRY BABY!');
      this.apiGetProducts();
    });
  };

  apiDeleteProduct = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/products/${id}`, config).then((res) => {
      alert(res.data ? 'OK BABY!' : 'SORRY BABY!');
      this.apiGetProducts();
    });
  };

  btnAddClick = (e) => {
    e.preventDefault();
    const { txtName: name, txtPrice, cmbCategory: category, imgProduct } = this.state;
    const price = parseInt(txtPrice);
    const image = imgProduct.replace(/^data:image\/\w+;base64,/, '');
    if (name && price && category && image) {
      this.apiPostProduct({ name, price, category, image });
    } else {
      alert('Please input name, price, category, and image');
    }
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/\w+;base64,/, '');
    if (id && name && price && category && image) {
      this.apiPutProduct(id, { name, price, category, image });
    } else {
      alert('Please input id, name, price, category, and image');
    }
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert('Please input id');
      }
    }
  };

  render() {
    return (
      <Container className="mt-5">
        <Card>
          <Card.Header className="text-center text-white" id="card-product-detail">
            <h3>PRODUCT DETAIL</h3>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" value={this.state.txtID} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" value={this.state.txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select value={this.state.cmbCategory} onChange={(e) => this.setState({ cmbCategory: e.target.value })}>
                      {this.state.categories.map((cate) => (
                        <option key={cate._id} value={cate._id}>{cate.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={this.previewImage} />
              </Form.Group>

              

              <div className="d-flex justify-content-around">
                <Button id="btn-select" onClick={this.btnAddClick}><i className="fas fa-plus"></i> Add New</Button>
                <Button id="btn-select" onClick={this.btnUpdateClick}><i className="fas fa-edit"></i> Update</Button>
                <Button id="btn-select"onClick={this.btnDeleteClick}><i className="fas fa-trash"></i> Delete</Button>
              </div>

              <div className="text-center mb-3 mt-3">
                <img src={this.state.imgProduct} width="300px" height="300px" alt="Preview" className="img-thumbnail" />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default ProductDetail;
