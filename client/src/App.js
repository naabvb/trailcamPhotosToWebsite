import React, { Component } from 'react';
import './App.css';
import Main from './main';

class ImagesGallery extends Component {
  state = {
    images: [],
  }

  render() {
    return (
      <Main />
    );
  }
}

export default ImagesGallery;
