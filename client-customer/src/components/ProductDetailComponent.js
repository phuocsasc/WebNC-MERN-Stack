import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
// npm install react-bootstrap bootstrap

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }
  render() {
    const prod = this.state.product;
    if (!prod) return <div />;

    return (
      <Container className="mt-5 form-product-top">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Row className="g-0">
                <Col md={6} className="d-flex align-items-center">
                  <Card.Img
                    src={`data:image/jpg;base64,${prod.image}`}
                    alt={prod.name}
                    className="img-fluid p-3 product-img-hover"
                  />
                </Col>
                <Col md={6}>
                  <Card.Body>
                    <Card.Title className="fw-bold text-primary">{prod.name}</Card.Title>
                    <Card.Text>
                      <strong>ID:</strong> {prod._id} <br />
                      <strong>Category:</strong> {prod.category.name} <br />
                      <strong>Price:</strong> ${prod.price}
                    </Card.Text>
                    <Form>
                      <Form.Group controlId="quantity">
                        <Form.Label>Quantity:</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max="99"
                          value={this.state.txtQuantity}
                          onChange={(e) => this.setState({ txtQuantity: e.target.value })}
                        />
                      </Form.Group>
                      <Button variant="primary" className="mt-3 w-100" onClick={(e) => this.btnAdd2CartClick(e)}>
                        ADD TO CART
                      </Button>
                    </Form>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }
  // event-handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex(x => x.product._id === product._id); // check if the _id exists in mycart
      if (index === -1) { // not found, push newItem
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else { // increasing the quantity
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert('Good job!');
    } else {
      alert('Please input quantity');
    }
  }
  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
}
export default withRouter(ProductDetail);