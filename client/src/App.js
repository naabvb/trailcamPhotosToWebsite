import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import CenteredTabs from './centeredTabs';

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
  
    return(
      <div> 
    <CenteredTabs />
    </div>
    );

  }
}

export default ImagesGallery;
