import React, { PureComponent } from 'react';
import Gallery from 'react-grid-gallery';
import '../App.css';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { withDialog } from 'muibox';
import { Typography } from '@material-ui/core';
import { stylesService } from '../services/stylesService';
import { imageService } from '../services/imageService';

class Images extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      status: this.props.status,
      prev: '',
      showEmpty: false,
    };
  }

  async componentDidMount() {
    const response = await axios.get('/api/images' + this.props.stage);
    if (response && response.data) {
      this.setState({ images: response.data, status: 'loaded', showEmpty: true });
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.state.status !== prevProps.status) {
      this.setState({ status: prevProps.status, prev: prevProps.stage });
    }
    if (this.props.stage !== prevProps.stage) {
      if (this.props.history.action === 'PUSH' || this.props.history.action === 'POP') {
        const response = await axios.get('/api/images' + this.props.stage);
        if (response && response.data) {
          this.setState({ images: response.data, status: 'loaded', prev: '', showEmpty: true });
        }
      }
    }
  }

  render() {
    if (this.state.status === 'loading' && this.props.stage !== this.state.prev) {
      stylesService.doBlur();
    }
    if (this.state.status === 'loaded') {
      stylesService.unBlur();
    }
    const { dialog } = this.props;
    const { images } = this.state;
    const heights = stylesService.isMobile() ? 170 : 280;
    let items = [];
    if (images && images.length > 0) {
      for (const [index, value] of images.entries()) {
        items.push(
          <div key={value.key} id={index}>
            <div className="clear"></div>
            <h3>{value.key}</h3>
            <LazyLoadComponent>
              <Gallery
                lightBoxProps={{
                  preventScroll: false,
                }}
                rowHeight={heights}
                margin={3}
                backdropClosesModal={!stylesService.isMobile()}
                enableImageSelection={false}
                images={value.values}
                customControls={imageService.getImageControls(this.props.role, dialog)}
              />
            </LazyLoadComponent>
          </div>
        );
      }
    } else {
      items = this.state.showEmpty ? (
        <Typography className="text-center nothingHere" align="center" variant="h6">
          Täällä ei ole mitään. Vielä{' '}
          <span role="img" aria-label="Emoji of deer">
            🦌
          </span>
        </Typography>
      ) : null;
    }
    return (
      <div className="image_page" id="image_page_id">
        {items}
      </div>
    );
  }
}

export default withDialog()(Images);
