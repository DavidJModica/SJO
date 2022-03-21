import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage, FormattedDate } from 'react-intl';

// Import Style
import styles from './QuoteListItem.css';

import Button from '@material-ui/core/Button';

const deleteButtonStyle = {
  'backgroundColor': '#FA1F2F',
  'color': '#FFF'
}

function QuoteListItem(props) {
  return (
    <div className={styles['single-quote']}>
      <h3 className={styles['quote-text']}>
        <Link to={`/admin/quotes/${props.quote._id}`} >
          "{props.quote.text}"
        </Link>
      </h3>
      <p className={styles['quote-author']}>- {props.quote.author}</p>
      <Button variant="raised" size="small" href="#" onClick={props.onDelete} style={deleteButtonStyle} className={styles['quote-action']}>
        <FormattedMessage id="delete"/>
      </Button>
      <hr className={styles.divider} />
    </div>
  );
}

QuoteListItem.propTypes = {
  quote: PropTypes.shape({
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default QuoteListItem;
