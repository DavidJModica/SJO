import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import MaterialUI Elements
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Import Actions
import { forgotPasswordRequest } from '../../AuthActions';

// Import Selectors
import { getErrorMessage, getMessage } from '../../AuthReducer';

// Import Styles
import styles from './ForgotPasswordPage.css';

function ErrorMessageBanner(props) {
  if(!props.errorMessage) {
    return null;
  }

  return (
    <div className="error">
      {props.errorMessage}
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

class ForgotPasswordPage extends Component {
  forgotPassword(event) {
    event.preventDefault();
    this.props.dispatch(forgotPasswordRequest({
      email: this.state.email,
    }));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  render() {
    return (
      <div>
        <ErrorMessageBanner errorMessage={this.props.errorMessage} />
        <MessageBanner message={this.props.message} />
        <form onSubmit={this.forgotPassword.bind(this)}>
          <h2 ><FormattedMessage id="forgotPasswordTitle" /></h2>
          <p>Enter your email and we'll send you a link to reset your password.</p>
          <TextField
            label={this.props.intl.messages.email}
            name="email"
            autoComplete="username"
            onChange={this.handleChange.bind(this)}
            required
            className={`${styles['text-field']}`}
          />
          <br/>
          <div id="forgot" className={`${styles['forgot-button']}`}>
            <Button
              variant="raised"
              label="sendResetEmail"
              type="submit"
              color="primary"
            >
              {this.props.intl.messages.sendResetEmail}
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
    errorMessage: getErrorMessage(state),
    message: getMessage(state)
  };
}

ForgotPasswordPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  errorMessage: PropTypes.string,
  message: PropTypes.string,
};

ForgotPasswordPage.contextTypes = {
  router: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(ForgotPasswordPage));
