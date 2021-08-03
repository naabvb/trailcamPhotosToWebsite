import React, { PureComponent } from 'react';
import Gallery from 'react-grid-gallery';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import '../App.css';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { withDialog } from 'muibox';

class Images extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      status: this.props.status,
      prev: '',
    };
  }

  async componentDidMount() {
    const response = await axios.get('/api/images/' + this.props.stage);
    if (response && response.data && response.data.length > 0) {
      this.setState({ images: response.data, status: 'loaded' });
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.state.status !== prevProps.status) {
      this.setState({ status: prevProps.status, prev: prevProps.stage });
    }
    if (this.props.stage !== prevProps.stage) {
      if (this.props.history.action === 'PUSH' || this.props.history.action === 'POP') {
        const response = await axios.get('/api/images/' + this.props.stage);
        if (response && response.data && response.data.length > 0) {
          this.setState({ images: response.data, status: 'loaded', prev: '' });
        }
      }
    }
  }

  doBlur() {
    window.requestAnimationFrame(function () {
      if (document.getElementById('image_page_id')) {
        document.getElementById('image_page_id').style.filter = 'blur(0px)';
        let body = document.getElementsByTagName('body')[0];
        body.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    });
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
      const url = lightbox.firstElementChild.firstElementChild.children[1].firstElementChild.src;
      return url;
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
    let url = this.getImageUrl();
    if (url) {
      let filename = url.split('\\').pop().split('/').pop();
      url = url + '?dl';
      fetch(url, {
        headers: new Headers({
          Origin: window.location.origin,
        }),
        mode: 'cors',
      })
        .then((response) => response.blob())
        .then((blob) => {
          let blobUrl = window.URL.createObjectURL(blob);
          this.forceDownload(blobUrl, filename);
        })
        .catch((e) => console.log(e));
    }
  }

  render() {
    if (this.state.status === 'loading' && this.props.stage !== this.state.prev) {
      if (document.getElementById('image_page_id')) {
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf('Edge') === -1) {
          // If not MS Edge
          document.getElementById('image_page_id').style.transition = 'filter .5s ease';
        }
        document.getElementById('image_page_id').style.webkitFilter = 'blur(0.15em)';
      }
    }
    if (this.state.status === 'loaded') {
      this.doBlur();
    }
    const { dialog } = this.props;
    const { images } = this.state;
    const isMobile = window.innerWidth < 1025;
    const heights = isMobile ? 170 : 280;
    const backdrop = isMobile ? false : true;
    let controls = null;

    if (this.props.role === 'vastila') {
      controls = [
        <Button
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
        </Button>,
        <Button
          id="downloadButton"
          color="primary"
          onClick={() => this.downloadResource()}
          className={'downloadbutton'}
          startIcon={<GetAppIcon />}
        >
          Lataa kuva
        </Button>,
      ];
    }

    if (this.props.role === 'jatkala') {
      controls = [
        <Button
          id="downloadButton"
          color="primary"
          onClick={() => this.downloadResource()}
          className={'downloadbutton'}
          startIcon={<GetAppIcon />}
        >
          Lataa kuva
        </Button>,
      ];
    }

    let items = [];
    if (images) {
      for (const [index, value] of images.entries()) {
        items.push(
          <div id={index}>
            <div className="clear"></div>
            <h3>{value.key}</h3>
            <LazyLoadComponent>
              <Gallery
                lightBoxProps={{
                  preventScroll: false,
                }}
                rowHeight={heights}
                margin={3}
                backdropClosesModal={backdrop}
                enableImageSelection={false}
                images={value.values}
                customControls={controls}
              />
            </LazyLoadComponent>
          </div>
        );
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

export default withDialog()(Images);
