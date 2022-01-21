import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Role } from '../constants/constants';
import { Dialog } from 'muibox';
import { deleteImage } from './apiService';

export const imageService = {
  getImageUrl,
  forceDownload,
  downloadResource,
  sendDeleteRequest,
  getImageControls,
};

function getImageUrl(): string {
  try {
    const lightbox = document.getElementById('lightboxBackdrop');
    const imageElement = lightbox!.firstElementChild!.firstElementChild!.children[1]!
      .firstElementChild! as HTMLImageElement;
    return imageElement.src;
  } catch (e) {
    console.log("Couldn't locate lightbox");
    return '';
  }
}

function forceDownload(blob: string, filename: string) {
  let a = document.createElement('a');
  a.download = filename;
  a.href = blob;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadResource() {
  const url = getImageUrl();
  if (url.length > 0) {
    const filename = url.split('\\').pop()?.split('/').pop();
    fetch(`${url}?dl`, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: 'cors',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        if (filename) forceDownload(blobUrl, filename);
      })
      .catch((e) => console.log(e));
  }
}

async function sendDeleteRequest() {
  const url = getImageUrl();
  if (url) {
    try {
      await deleteImage(url);
      document.location.reload();
    } catch (e) {
      console.log('Delete fail');
    }
  }
}

function getImageControls(role: string, dialog: Dialog) {
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
  if (role === Role.Vastila) {
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
            .then(() => sendDeleteRequest())
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
