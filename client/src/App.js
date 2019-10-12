import React, { Component } from 'react';
import './App.css';
import CenteredTabs from './centeredTabs';

class ImagesGallery extends Component {
  state = {
    images: [],
  }

  render() {
    return (
      <CenteredTabs />
    );
  }
}

export default ImagesGallery;
