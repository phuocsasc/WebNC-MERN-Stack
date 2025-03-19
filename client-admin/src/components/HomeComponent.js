import React, { Component } from 'react';
import imgSrc from '../imgs/ezgifcomresize.gif';

class Home extends Component {
  render() {
    return (
      <div className="align-center content">
        <h2 className="text-center">ADMIN HOME</h2>
        <img src={imgSrc} width="800px" height="600px" alt="Admin Home" />
      </div>
    );
  }
}
export default Home;