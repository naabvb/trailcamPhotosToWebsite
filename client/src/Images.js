import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import './App.css';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

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
        let items = [];
        if (images) {
            for (const [index, value] of images.entries()) {
                items.push(<div id={index}>
                    <div className="clear"></div><h3>{value.key}</h3>
                    <LazyLoadComponent>
                        <Gallery rowHeight={300} margin={3} backdropClosesModal={true} enableImageSelection={false} images={value.values} />
                    </LazyLoadComponent>
                </div>)
            }
        } else {
            items = null;
        }
        return (
            <div className="image_page">
                {items}
            </div>
        );
    }
}

export default ImagesG;
