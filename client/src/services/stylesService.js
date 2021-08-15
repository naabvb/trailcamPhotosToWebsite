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

function setFooter() {
  document.getElementById('footer_block').style.display = 'block';
  document.getElementById('footer_block').style.position = 'absolute';
  document.getElementsByTagName('html')[0].style.height = 'auto';
  document.getElementsByTagName('html')[0].style.overflowY = 'visible';
  document.getElementsByTagName('body')[0].style.overflowY = 'visible';
  document.getElementById('root').style.minHeight = 0;
}

function doBlur() {
  if (document.getElementById('image_page_id')) {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Edge') === -1) {
      // If not MS Edge
      document.getElementById('image_page_id').style.transition = 'filter .5s ease';
    }
    document.getElementById('image_page_id').style.webkitFilter = 'blur(0.15em)';
  }
}

function unBlur() {
  window.requestAnimationFrame(() => {
    if (document.getElementById('image_page_id')) {
      document.getElementById('image_page_id').style.filter = 'blur(0px)';
      scrollTop();
    }
  });
}

function isMobile() {
  return window.innerWidth < 1025;
}

function scrollTop() {
  let body = document.getElementsByTagName('body')[0];
  body.scrollTop = 0;
  window.scrollTo(0, 0);
  if (isMobile() && !routeService.isLoginPage()) {
    setMobileFooter();
  }
}

function setGalleryHeight() {
  document.getElementById('footer_block').style.display = 'block';
  document.getElementById('footer_block').style.position = 'static';
  document.getElementById('root').style.minHeight = '2000px';
}

function setMobileFooter() {
  document.getElementById('footer_block').style.marginBottom = '4.1em';
}
