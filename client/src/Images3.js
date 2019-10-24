import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import './App.css';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

class ImagesG3 extends Component {
    state = {
        images: [],
    }
    async componentDidMount() {
        const response = await axios.get('/api/images/3')
        if (response && response.data && response.data.length > 0) {
            this.setState({ images: response.data })
        }
    }

    render() {
        const { images } = this.state;
        const isMobile = window.innerWidth < 1025;
        const heights = isMobile ? 170 : 280;
        const backdrop = isMobile ? false : true;
        let items = [];
        if (images) {
            for (const [index, value] of images.entries()) {
                items.push(<div id={index}>
                    <div className="clear"></div><h3>{value.key}</h3>
                    <LazyLoadComponent>
                        <Gallery rowHeight={heights} margin={3} backdropClosesModal={backdrop} enableImageSelection={false} images={value.values} />
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

export default ImagesG3;
