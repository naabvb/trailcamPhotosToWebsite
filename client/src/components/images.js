import React, { PureComponent } from 'react';
import Gallery from 'react-grid-gallery';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import '../App.css';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { withDialog } from 'muibox';
import { Typography } from '@material-ui/core';
import { stylesService } from '../services/stylesService';

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

  async deleteImage() {
    const url = this.getImageUrl();
    if (url) {
      try {
        await axios.get('/api/delete-image', {
          params: {
            img_url: url,
          },
        });
        document.location.reload();
      } catch (e) {
        console.log('Delete fail');
      }
    }
  }

  getImageUrl() {
    try {
      const lightbox = document.getElementById('lightboxBackdrop');
      return lightbox.firstElementChild.firstElementChild.children[1].firstElementChild.src;
    } catch (e) {
      console.log("Couldn't locate lightbox");
    }
  }

  forceDownload(blob, filename) {
    let a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  downloadResource() {
    const url = this.getImageUrl();
    if (url) {
      const filename = url.split('\\').pop().split('/').pop();
      fetch(`${url}?dl`, {
        headers: new Headers({
          Origin: window.location.origin,
        }),
        mode: 'cors',
      })
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          this.forceDownload(blobUrl, filename);
        })
        .catch((e) => console.log(e));
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
    let controls = [
      <Button
        key="downloadButton"
        id="downloadButton"
        color="primary"
        onClick={() => this.downloadResource()}
        className={'downloadbutton'}
        startIcon={<GetAppIcon />}
      >
        Lataa kuva
      </Button>,
    ];

    if (this.props.role === 'vastila') {
      controls.unshift(
        <Button
          key="deleteButton"
          id="deleteButton"
          color="secondary"
          onClick={() =>
            dialog
              .confirm({
                title: 'Poista kuva',
                message: 'Haluatko poistaa kuvan?',
                ok: { text: 'Ok', color: 'primary' },
                cancel: { text: 'Peruuta', color: 'secondary' },
              })
              .then(() => this.deleteImage())
              .catch(() => {})
          }
          className={'deletebutton'}
          startIcon={<DeleteIcon />}
        >
          Poista kuva
        </Button>
      );
    }

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
                customControls={controls}
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
