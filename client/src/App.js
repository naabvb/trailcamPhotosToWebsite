import React, { Component } from 'react';
import './App.css';

class ImagesGallery extends Component {
  state = {
    images: null,
  }

  async componentDidMount() {
    this.getAlbums();
  }

  getAlbums = () => {
    fetch('/api/images')
      .then(results => results.json())
      .then(images => this.setState({ images }));
  }

  render() {
    const { images } = this.state;
    return (

      <div className="App">
        <h1>WIP</h1>
      </div>
    )
  }
}

export default ImagesGallery;
