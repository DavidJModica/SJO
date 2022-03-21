import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import MaterialUI Elements
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Import Actions
import { resetPasswordRequest } from '../../AuthActions';

// Import Selectors
import { getErrorMessage, getMessage } from '../../AuthReducer';

// Import Styles
import styles from './ResetPasswordPage.css';

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

class ResetPasswordPage extends Component {
  requestReset(event) {
    event.preventDefault();
    this.props.dispatch(resetPasswordRequest(
      this.props.params.resetPasswordToken,
      this.state.password,
      this.state.verifyPassword
    ));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  render() {
    return (
      <div>
        <ErrorMessageBanner errorMessage={this.props.errorMessage} />
        <MessageBanner message={this.props.message} />
        <form onSubmit={this.requestReset.bind(this)}>
          <h2 ><FormattedMessage id="resetPasswordTitle" /></h2>
          <p>Enter your new password.</p>
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
          <TextField
            label={this.props.intl.messages.verifyPassword}
            type="password"
            name="verifyPassword"
            autoComplete="current-password"
            onChange={this.handleChange.bind(this)}
            required
            className={`${styles['text-field']}`}
          />
          <br/>
          <div id="reset" className={`${styles['reset-button']}`}>
            <Button
              variant="raised"
              label="requestReset"
              type="submit"
              color="primary"
            >
              {this.props.intl.messages.resetPassword}
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

ResetPasswordPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  errorMessage: PropTypes.string,
  message: PropTypes.string,
};

ResetPasswordPage.contextTypes = {
  router: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(ResetPasswordPage));
