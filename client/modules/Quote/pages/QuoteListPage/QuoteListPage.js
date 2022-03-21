import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

// Import Components
import QuoteList from '../../components/QuoteList';
//import QuoteCreateWidget from '../../components/QuoteCreateWidget/QuoteCreateWidget';

// Import Actions
import { addQuoteRequest, fetchQuotes, deleteQuoteRequest } from '../../QuoteActions';
import { toggleAddQuote, addUserProps } from '../../../App/AppActions';

// Import Selectors
import { getQuotes } from '../../QuoteReducer';
import { getToken } from '../../../Auth/AuthReducer';

import Button from '@material-ui/core/Button';

// Import Style
import styles from './QuoteListPage.css';

// Import Cookies
import { Cookies, withCookies } from 'react-cookie';

class QuoteListPage extends Component {
  componentDidMount() {
    // TODO: Make sure we're not loading on the client side for no reason when page was SSR'ed
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(fetchQuotes(token));
  }

  handleAddQuote = () => {
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(addQuoteRequest(token));
  };

  handleDeleteQuote = (quote) => {
    if (confirm('Do you want to delete this quote?')) { // eslint-disable-line
      const { cookies } = this.props;
      const token = cookies.get('sales-journal-token');
      this.props.dispatch(deleteQuoteRequest(quote, token));
    }
  };

  render() {
    return (
      <div>
        <div className={styles['add-quote-button']}>
          <Button variant="raised" color="secondary" onClick={this.handleAddQuote}>
            Add Quote
          </Button>
        </div>
        <div id="list">
          <QuoteList handleDeleteQuote={this.handleDeleteQuote} quotes={this.props.quotes} />
        </div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
QuoteListPage.need = [(params) => { return fetchQuotes(params.token); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    quotes: getQuotes(state),
  };
}

QuoteListPage.propTypes = {
  quotes: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    author: PropTypes.string,
  })).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  dispatch: PropTypes.func.isRequired,
};

QuoteListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(withCookies(QuoteListPage));
