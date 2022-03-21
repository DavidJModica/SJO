import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Import MaterialUI Elements
import Button from '@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/Group';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';

// Import Style
import styles from './AdminPage.css';

class AdminPage extends Component {
  render() {
    return (
      <div>
        <div className={styles['button']}>
          <Button variant="raised" color="secondary" href="/admin/quotes">
            <FormatQuoteIcon className={styles['leftIcon']} />
            <FormattedMessage id="quoteList" />
          </Button>
        </div>
        <div className={styles['button']}>
          <Button variant="raised" color="secondary" href="/admin/users">
            <GroupIcon className={styles['leftIcon']} />
            <FormattedMessage id="userList" />
          </Button>
        </div>
      </div>
    );
  }
}

export default AdminPage;
