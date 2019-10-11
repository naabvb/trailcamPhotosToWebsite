import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import './App.css';
import axios from 'axios';

class ImagesGallery extends Component {
  state = {
    images: [],
  }


  async componentDidMount() {
    const response = await axios.get('/api/images')
    if (response && response.data && response.data.length > 0) {
      this.setState({ images: response.data })
    }
  }

  render() {
    const { images } = this.state;
    return images ?

      <Gallery backdropClosesModal={true} enableImageSelection={false} images={images} /> : null


  }
}

export default ImagesGallery;
