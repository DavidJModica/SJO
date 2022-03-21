/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/App/pages/HomePage/HomePage');
  require('./modules/App/pages/LearnMorePage/LearnMorePage');
  require('./modules/Entry/pages/EntryListPage/EntryListPage');
  require('./modules/Entry/pages/EntryDetailPage/EntryDetailPage');
  require('./modules/Auth/pages/SignupPage/SignupPage');
  require('./modules/Auth/pages/LoginPage/LoginPage');
  require('./modules/Auth/pages/ForgotPasswordPage/ForgotPasswordPage');
  require('./modules/Auth/pages/ResetPasswordPage/ResetPasswordPage');
  require('./modules/Admin/pages/AdminPage/AdminPage');
  require('./modules/Quote/pages/QuoteListPage/QuoteListPage');
  require('./modules/Quote/pages/QuoteDetailPage/QuoteDetailPage');
  require('./modules/User/pages/UserListPage/UserListPage');
  require('./components/EnsureLoggedInContainer');
  require('./components/EnsureNotLoggedInContainer');
  require('./components/EnsureAdminContainer');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/App/pages/HomePage/HomePage').default);
        });
      }}
    />
    <Route
      path="/learn-more"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/App/pages/LearnMorePage/LearnMorePage').default);
        });
      }}
    />
    <Route
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./components/EnsureNotLoggedInContainer').default);
        });
    }}>
      <Route
        path="/auth/signup"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Auth/pages/SignupPage/SignupPage').default);
          });
        }}
      />
      <Route
        path="/auth/login"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Auth/pages/LoginPage/LoginPage').default);
          });
        }}
      />
      <Route
        path="/auth/forgot-password"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Auth/pages/ForgotPasswordPage/ForgotPasswordPage').default);
          });
        }}
      />
      <Route
        path="/auth/reset-password/:resetPasswordToken"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Auth/pages/ResetPasswordPage/ResetPasswordPage').default);
          });
        }}
      />
    </Route>
    <Route
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./components/EnsureLoggedInContainer').default);
        });
    }}>
      <Route
        path="/entries"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Entry/pages/EntryListPage/EntryListPage').default);
          });
        }}
      />
      <Route
        path="/entries/:id"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Entry/pages/EntryDetailPage/EntryDetailPage').default);
          });
        }}
      />
    </Route>
    <Route
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./components/EnsureAdminContainer').default);
        });
    }}>
      <Route
        path="/admin"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Admin/pages/AdminPage/AdminPage').default);
          });
        }}
      />
      <Route
        path="/admin/quotes"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Quote/pages/QuoteListPage/QuoteListPage').default);
          });
        }}
      />
      <Route
        path="/admin/quotes/:id"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Quote/pages/QuoteDetailPage/QuoteDetailPage').default);
          });
        }}
      />
      <Route
        path="/admin/users"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/User/pages/UserListPage/UserListPage').default);
          });
        }}
      />
    </Route>
  </Route>
);
