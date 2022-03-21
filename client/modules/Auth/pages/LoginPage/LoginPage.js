import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import MaterialUI Elements
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Import Actions
import { logInRequest } from '../../AuthActions';

// Import Selectors
import { getErrorMessage, getMessage } from '../../AuthReducer';

// Import Styles
import styles from './LoginPage.css';

function ErrorBanner(props) {
  if(!props.errorMessage) {
    return null;
  }

  return (
    <div className="error">
      Error! {props.errorMessage}
    </div>
  );
}

function MessageBanner(props) {
  if(!props.message) {
    return null;
  }

  return (
    <div className="message">
      {props.message}
    </div>
  );
}

class LoginPage extends Component {
  login(event) {
    event.preventDefault();
    this.props.dispatch(logInRequest({
      email: this.state.email,
      password: this.state.password,
    }));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  render() {
    return (
      <div>
        <ErrorBanner errorMessage={this.props.errorMessage} />
        <MessageBanner message={this.props.message} />
        <form onSubmit={this.login.bind(this)}>
          <h2><FormattedMessage id="login" /></h2>
          <TextField
            label={this.props.intl.messages.email}
            name="email"
            autoComplete="username"
            onChange={this.handleChange.bind(this)}
            required
            className={`${styles['text-field']}`}
          />
          <br/>
          <TextField
            label={this.props.intl.messages.password}
            type="password"
            name="password"
            autoComplete="current-password"
            onChange={this.handleChange.bind(this)}
            required
            className={`${styles['text-field']}`}
          />
          <br/>
          <div id="login" className={`${styles['login-button']}`}>
            <Button
              variant="raised"
              label="login"
              type="submit"
              color="primary"
            >
              {this.props.intl.messages.login}
            </Button>
          </div>
          <a href="/auth/forgot-password">Forgot password?</a>
        </form>

      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    errorMessage: getErrorMessage(state),
    message: getMessage(state)
  };
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  errorMessage: PropTypes.string,
  message: PropTypes.string,
};

LoginPage.contextTypes = {
  router: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(LoginPage));
