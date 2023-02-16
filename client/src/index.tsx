import React from 'react';
import ReactDOM from 'react-dom';
import { DialogProvider } from 'muibox';
import './index.css';
import './app.css';
import Main from './main';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <DialogProvider>
    <Main />
  </DialogProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register({immediate: true});
serviceWorkerRegistration.register();
