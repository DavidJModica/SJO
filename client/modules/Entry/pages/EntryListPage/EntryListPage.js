import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

// Import Components
import EntryList from '../../components/EntryList';
//import EntryCreateWidget from '../../components/EntryCreateWidget/EntryCreateWidget';

// Import Actions
import { addEntryRequest, fetchEntries, deleteEntryRequest } from '../../EntryActions';
import { toggleAddEntry, addUserProps } from '../../../App/AppActions';

// Import Selectors
import { getEntries } from '../../EntryReducer';
import { getToken } from '../../../Auth/AuthReducer';

import Button from '@material-ui/core/Button';

// Import Style
import styles from './EntryListPage.css';

// Import Cookies
import { Cookies, withCookies } from 'react-cookie';

class EntryListPage extends Component {
  componentDidMount() {
    // TODO: Make sure we're not loading on the client side for no reason when page was SSR'ed
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(fetchEntries(token));
  }

  handleAddEntry = () => {
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(addEntryRequest(token));
  };

  handleDeleteEntry = (entry) => {
    if (confirm('Do you want to delete this entry?')) { // eslint-disable-line
      const { cookies } = this.props;
      const token = cookies.get('sales-journal-token');
      this.props.dispatch(deleteEntryRequest(entry, token));
    }
  };

  render() {
    return (
      <div>
        <div className={styles['add-entry-button']}>
          <Button variant="raised" color="secondary" onClick={this.handleAddEntry}>
            Add Entry
          </Button>
        </div>
        <div id="list" className={`${(this.props.entries.length > 0 ? styles.show : styles.hide)}`}>
          <EntryList handleDeleteEntry={this.handleDeleteEntry} entries={this.props.entries} />
        </div>
        <div id="prompt" className={`${(this.props.entries.length == 0 ? styles.show : styles.hide)}`}>
          <h2>The first step to being more productive is right in front of you.</h2>
          <h2>Add an entry and get on your way to crushing your quota!</h2>
        </div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
EntryListPage.need = [(params) => { return fetchEntries(params.token); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    entries: getEntries(state),
  };
}

EntryListPage.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
  })).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  dispatch: PropTypes.func.isRequired,
};

EntryListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(withCookies(EntryListPage));
