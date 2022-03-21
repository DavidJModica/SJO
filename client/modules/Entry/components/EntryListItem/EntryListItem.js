import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage, FormattedDate } from 'react-intl';

// Import Style
import styles from './EntryListItem.css';

import Button from '@material-ui/core/Button';

const deleteButtonStyle = {
  'backgroundColor': '#FA1F2F',
  'color': '#FFF'
}

function EntryListItem(props) {
  return (
    <div className={styles['single-entry']}>
      <h3 className={styles['entry-date']}>
        <Link to={`/entries/${props.entry._id}`} >
          <FormattedDate
            value={new Date(props.entry.date)}
            weekday='long'
            year='numeric'
            month='long'
            day='2-digit'
          />
        </Link>
      </h3>
      <p className={styles['entry-type']}>{props.entry.type} Entry</p>
      <Button variant="raised" size="small" href="#" onClick={props.onDelete} style={deleteButtonStyle} className={styles['entry-action']}>
        <FormattedMessage id="delete"/>
      </Button>
      <hr className={styles.divider} />
    </div>
  );
}

EntryListItem.propTypes = {
  entry: PropTypes.shape({
    date: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EntryListItem;
