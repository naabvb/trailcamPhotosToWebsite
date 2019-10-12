import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import './App.css';
import axios from 'axios';

class ImagesG2 extends Component {
    state = {
        images: [],
    }
    async componentDidMount() {
        const response = await axios.get('/api/images/2')
        if (response && response.data && response.data.length > 0) {
            this.setState({ images: response.data })
        }
    }

    render() {
        const { images } = this.state;
        let items = [];
        if (images) {
            for (const [index, value] of images.entries()) {
                items.push(<div><section id={index}><h3>{value.key}</h3></section><Gallery rowHeight={300} margin={3} backdropClosesModal={true} enableImageSelection={false} images={value.values} /></div>)
            }
        } else {
            items = null;
        }
        return (
            <div>
                {items}
            </div>
        );
    }
}

export default ImagesG2;
