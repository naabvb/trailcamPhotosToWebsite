import React, { PureComponent } from 'react';
import Gallery from 'react-grid-gallery';
import '../App.css';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

class Images extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            status: this.props.status,
            prev: ""
        }
    }

    async componentDidMount() {
        const response = await axios.get('/api/images/' + this.props.stage)
        if (response && response.data && response.data.length > 0) {
            this.setState({ images: response.data, status: "loaded" })
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.state.status !== prevProps.status) {
            this.setState({ status: prevProps.status, prev: prevProps.stage })
        }
        if (this.props.stage !== prevProps.stage) {
            if (this.props.history.action === 'PUSH' || this.props.history.action === 'POP') {
                const response = await axios.get('/api/images/' + this.props.stage)
                if (response && response.data && response.data.length > 0) {
                    this.setState({ images: response.data, status: "loaded", prev: "" })
                }
            }
        }
    }

    doBlur() {
        window.requestAnimationFrame(function () {
            if (document.getElementById('image_page_id')) {
                document.getElementById("image_page_id").style.filter = "blur(0px)"
                window.scrollTo(0, 0);
            }
        });
    }

    render() {
        if (this.state.status === "loading" && this.props.stage !== this.state.prev) {
            if (document.getElementById('image_page_id')) {
                var useragent = window.navigator.userAgent
                if (useragent.indexOf("Edge") === -1) { // If not MS Edge
                    document.getElementById("image_page_id").style.transition = "filter .5s ease"
                }
                document.getElementById("image_page_id").style.webkitFilter = "blur(0.15em)"
            }
        }
        if (this.state.status === "loaded") {
            this.doBlur()
        }

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
                        <Gallery lightBoxProps={{
                            preventScroll: false
                        }} rowHeight={heights} margin={3} backdropClosesModal={backdrop} enableImageSelection={false} images={value.values} />
                    </LazyLoadComponent>
                </div>)
            }
        } else {
            items = null;
        }
        return (
            <div className="image_page" id="image_page_id">
                {items}
            </div>
        );
    }
}

export default Images;