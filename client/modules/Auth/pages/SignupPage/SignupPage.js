import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import MaterialUI Elements
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Import Actions
import { signUpRequest } from '../../AuthActions';

// Import Selectors
import { getErrorMessage } from '../../AuthReducer';

// Import Styles
import styles from './SignupPage.css';

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

class SignupPage extends Component {
  signup(event) {
    event.preventDefault();
    this.props.dispatch(signUpRequest({
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
        <form onSubmit={this.signup.bind(this)}>
          <h2><FormattedMessage id="register" /></h2>
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
          <div id="signup" className={`${styles['signup-button']}`}>
            <Button
              variant="raised"
              label="register"
              type="submit"
              color="primary"
            >
              {this.props.intl.messages.register}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    errorMessage: getErrorMessage(state)
  };
}

SignupPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  errorMessage: PropTypes.string,
};

SignupPage.contextTypes = {
  router: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(SignupPage));
