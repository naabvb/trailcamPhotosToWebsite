import React, { Component } from 'react';
import './App.css';

class ImagesGallery extends Component {
  state = {
    images: null,
  }

  async componentDidMount() {
    const response = await axios.get(
      'https://google-photos-album-demo.glitch.me/YOUR_ALBUM_ID'
    )
    if (response && response.data && response.data.length > 0) {
      this.setState({
        images: response.data.map((url: string) => ({
          original: `${url}=w1024`,
          thumbnail: `${url}=w100`,
        })),
      })
    }


  } render() {
    const { images } = this.state
    return images ? <ImageGallery items={images} /> : null
  }
}

}



export default ImagesGallery;
