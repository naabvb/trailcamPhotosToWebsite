import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';

export const imageService = {
  getImageUrl,
  forceDownload,
  downloadResource,
  deleteImage,
  getImageControls,
};

function getImageUrl() {
  try {
    const lightbox = document.getElementById('lightboxBackdrop');
    return lightbox.firstElementChild.firstElementChild.children[1].firstElementChild.src;
  } catch (e) {
    console.log("Couldn't locate lightbox");
  }
}

function forceDownload(blob, filename) {
  let a = document.createElement('a');
  a.download = filename;
  a.href = blob;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadResource() {
  const url = getImageUrl();
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
        forceDownload(blobUrl, filename);
      })
      .catch((e) => console.log(e));
  }
}

async function deleteImage() {
  const url = getImageUrl();
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

function getImageControls(role, dialog) {
  let controls = [
    <Button
      key="downloadButton"
      id="downloadButton"
      color="primary"
      onClick={() => downloadResource()}
      className={'downloadbutton'}
      startIcon={<GetAppIcon />}
    >
      Lataa kuva
    </Button>,
  ];
  if (role === 'vastila') {
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
            .then(() => deleteImage())
            .catch(() => {})
        }
        className={'deletebutton'}
        startIcon={<DeleteIcon />}
      >
        Poista kuva
      </Button>
    );
  }
  return controls;
}
