import { routeService } from './routeService';

export const stylesService = {
  setFooter,
  doBlur,
  unBlur,
  isMobile,
  scrollTop,
  setGalleryHeight,
  setMobileFooter,
};

function getElementById(id: string) {
  return document.getElementById(id);
}

function setFooter() {
  const footerBlock = getElementById('footer_block');
  const footerSpan = getElementById('footer_text');
  if (footerBlock && footerSpan) {
    footerBlock.style.display = 'block';
    footerBlock.style.position = 'absolute';
    footerBlock.style.marginBottom = '0';
    footerSpan.style.display = 'inline';
  }
  const [html] = document.getElementsByTagName('html');
  const [body] = document.getElementsByTagName('body');
  html.style.height = 'auto';
  html.style.overflowY = 'visible';
  body.style.overflowY = 'visible';
  const root = getElementById('root');
  if (root) {
    root.style.minHeight = '0';
  }
}

function doBlur() {
  const imagesContainer = getElementById('images_container');
  if (imagesContainer) {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Edge') === -1) {
      // If not MS Edge
      imagesContainer.style.transition = 'filter .5s ease';
    }
    imagesContainer.style.webkitFilter = 'blur(0.15em)';
  }
}

function unBlur() {
  const imagesContainer = getElementById('images_container');
  window.requestAnimationFrame(() => {
    if (imagesContainer) {
      imagesContainer.style.filter = 'blur(0px)';
      scrollTop();
    }
  });
}

function isMobile() {
  return window.innerWidth < 1025;
}

function scrollTop() {
  const [body] = document.getElementsByTagName('body');
  body.scrollTop = 0;
  window.scrollTo(0, 0);
  if (isMobile() && !routeService.isLoginPage()) {
    setMobileFooter();
  }
}

function setGalleryHeight() {
  const footerBlock = getElementById('footer_block');
  if (footerBlock) {
    footerBlock.style.display = 'block';
    footerBlock.style.position = 'static';
  }
  const root = getElementById('root');
  if (root) {
    root.style.minHeight = '2000px';
  }
}

function setMobileFooter() {
  const footerBlock = getElementById('footer_block');
  const footerSpan = getElementById('footer_text');
  if (footerBlock && footerSpan) {
    footerBlock.style.marginBottom = '6em';
    footerSpan.style.display = 'none';
  }
}
