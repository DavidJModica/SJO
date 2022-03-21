import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';

// Import MaterialUI Elements
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Import Custom Components
import Notification from '../../../../components/Notification';

// Import Style
import styles from './QuoteDetailPage.css';

// Import Actions
import { fetchQuote, saveQuoteRequest } from '../../QuoteActions';

// Import Selectors
import { getQuote, getMessage, getNotificationState, getNotificationType } from '../../QuoteReducer';
import { getToken } from '../../../Auth/AuthReducer';

// Import Cookies
import { Cookies, withCookies } from 'react-cookie'

class QuoteDetailPage extends Component {
  constructor(props) {
    super(props);

    // The weirdness with schedule is to make sure that all 10 schedule
    // TextFields have an initial value to prevent React from complaining
    // that it's going from uncontrolled to controlled. We're also converting
    // the date into a format the text field recognizes.
    this.state = {
      author: this.props.quote.author || "",
      text: this.props.quote.text || "",
      _id: this.props.quote._id,
      notification: this.props.notification,
      width: 0,
      height: 0,
    };
  }

  handleWindowClose(event) {
    event.preventDefault();
    return event.returnValue = '';
  };

  componentDidMount() {
    // TODO: Check state for quote before making API call to fetch it
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(fetchQuote(this.props.params.id, token));
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  handleChange(event) {
    // To update the schedule we need to create a mutable
    // copy of the array from state, then update it and
    // set the entire schedule array in state at once
    window.addEventListener('beforeunload', this.handleWindowClose);
    this.setState({ [event.target.name]: event.target.value });
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ notification: false });
  };

  save(event) {
    event.preventDefault();
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(saveQuoteRequest(this.state, token));
    this.setState({ notification: true });
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

  render() {
    const saveButtonClassName = classNames(styles['save-quote-button'],
      (this.state.notification && this.state.width < 1280) ? styles['save-move-up'] : styles['save-move-down']);

    return (
      <div>
        <div className={`${(this.state.notification ? styles.flex : styles.hide)}`}>
          <Notification
            open={this.state.notification}
            onClose={this.handleClose}
            variant={this.props.notificationType}
            message={this.props.message}
          />
        </div>
        <form onSubmit={this.save.bind(this)}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <h5>TEXT</h5>
              <TextField
                id="text"
                name="text"
                label="Quote text, something inspirational."
                value={this.state.text}
                onChange={this.handleChange.bind(this)}
                margin="dense"
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <h5>AUTHOR</h5>
                <TextField
                  id="author"
                  name="author"
                  label="The person who said the thing."
                  value={this.state.author}
                  onChange={this.handleChange.bind(this)}
                  margin="dense"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Grid>
          <div id="save" className={saveButtonClassName}>
            <Button
              variant="raised"
              label="save"
              type="submit"
              color="secondary"
              fullWidth
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
QuoteDetailPage.need = [
  (params) => { return fetchQuote(params.id, params.token); }
];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    quote: getQuote(state, props.params.id),
    token: getToken(state),
    message: getMessage(state),
    notification: getNotificationState(state),
    notificationType: getNotificationType(state),
  };
}

QuoteDetailPage.propTypes = {
  quote: PropTypes.shape({
    author: PropTypes.string,
    text: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string,
  notification: PropTypes.bool,
  notificationType: PropTypes.oneOf(['info', 'success', 'error']),
};

QuoteDetailPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(withCookies(QuoteDetailPage));
