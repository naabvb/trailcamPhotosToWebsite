import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import './App.css';
import axios from 'axios';

class ImagesG extends Component {
    state = {
        images: [],
    }
    async componentDidMount() {
        const response = await axios.get('/api/images/1')
        if (response && response.data && response.data.length > 0) {
            this.setState({ images: response.data })
        }
    }

    render() {
        const { images } = this.state;
        let gallery;
        if (images) {
            gallery = <Gallery rowHeight={300} margin={3} backdropClosesModal={true} enableImageSelection={false} images={images} />;
        } else {
            gallery = null;
        }
        return (
            <div>
                {gallery}
            </div>
        );
    }
}

export default ImagesG;
