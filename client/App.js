/**
 * Root Component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import IntlWrapper from './modules/Intl/IntlWrapper';

// Import Routes
import routes from './routes';

// Import Cookies
import { CookiesProvider } from 'react-cookie';

// Base stylesheet
require('./main.css');

export default function App(props) {
  return (
    <Provider store={props.store}>
      <IntlWrapper>
        <CookiesProvider>
          <Router history={browserHistory}>
            {routes}
          </Router>
        </CookiesProvider>
      </IntlWrapper>
    </Provider>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired,
};
