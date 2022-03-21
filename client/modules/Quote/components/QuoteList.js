import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import QuoteListItem from './QuoteListItem/QuoteListItem';

function QuoteList(props) {
  return (
    <div className="listView">
      {
        props.quotes.map(quote => (
          <QuoteListItem
            quote={quote}
            key={quote._id}
            onDelete={() => props.handleDeleteQuote(quote._id)}
          />
        ))
      }
    </div>
  );
}

QuoteList.propTypes = {
  quotes: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
  handleDeleteQuote: PropTypes.func.isRequired,
};

export default QuoteList;
