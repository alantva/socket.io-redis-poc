import 'raf/polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';

import App from './App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app'),
);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}
