import React, { PureComponent } from 'react';
import Gallery from 'react-grid-gallery';
import '../app.css';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { withDialog } from 'muibox';
import { Typography } from '@material-ui/core';
import { stylesService } from '../services/stylesService';
import { imageService } from '../services/imageService';
import { ImagesProps, ImagesState } from '../interfaces/images';
import { LoadingState } from '../constants/constants';
import { getImagesFromApi } from '../services/apiService';

class Images extends PureComponent<ImagesProps, ImagesState> {
  constructor(props: ImagesProps) {
    super(props);
    this.state = {
      images: [],
      status: this.props.status,
      prev: '',
      showEmpty: false,
    };
  }

  async componentDidMount() {
    const response = await getImagesFromApi(this.props.stage);
    if (response && response.data) {
      this.setState({ images: response.data, status: LoadingState.Loaded, showEmpty: true });
    }
  }

  async componentDidUpdate(prevProps: ImagesProps) {
    if (this.state.status !== prevProps.status) {
      this.setState({ status: prevProps.status, prev: prevProps.stage });
    }
    if (this.props.stage !== prevProps.stage) {
      if (this.props.history.action === 'PUSH' || this.props.history.action === 'POP') {
        const response = await getImagesFromApi(this.props.stage);
        if (response && response.data) {
          this.setState({ images: response.data, status: LoadingState.Loaded, prev: '', showEmpty: true });
        }
      }
    }
  }

  render() {
    if (this.state.status === LoadingState.Loading && this.props.stage !== this.state.prev) {
      stylesService.doBlur();
    }
    if (this.state.status === LoadingState.Loaded) {
      stylesService.unBlur();
    }

    const images = this.state.images;
    const heights = stylesService.isMobile() ? 170 : 280;
    let items: JSX.Element[] = [];
    if (images && images.length > 0) {
      for (const [index, value] of images.entries()) {
        items.push(
          <div key={value.key} id={index.toString()}>
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
                customControls={imageService.getImageControls(this.props.role, this.props.dialog)}
              />
            </LazyLoadComponent>
          </div>
        );
      }
    } else {
      items = this.state.showEmpty
        ? [
            <div>
              <Typography className="text-center nothingHere" align="center" variant="h6">
                Täällä ei ole mitään. Vielä{' '}
                <span role="img" aria-label="Emoji of deer">
                  🦌
                </span>
              </Typography>
            </div>,
          ]
        : [<div />];
    }
    return (
      <div className="image_page" id="image_page_id">
        {items}
      </div>
    );
  }
}

export default withDialog()(Images);
