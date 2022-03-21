import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// Import Style
import styles from './QuoteWidget.css';

function QuoteWidget(props) {
  return (
    <div className={`${(props.quote.text != '' ? styles['quote-holder'] : styles['hide'])}`}>
      <p className={styles['quote-text']}>"{props.quote.text}"</p>
      <p className={styles['quote-author']}>- {props.quote.author}</p>
    </div>
  );
}

QuoteWidget.propTypes = {
  quote: PropTypes.shape({
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }).isRequired,
};

export default QuoteWidget;
