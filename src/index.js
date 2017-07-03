import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './js/containers/AppContainer';
import NotFound from './js/components/NotFound.jsx';
import { store } from './js/redux/index';
import './assets/styles/main.scss';


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('App')
);