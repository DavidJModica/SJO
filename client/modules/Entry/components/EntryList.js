import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import EntryListItem from './EntryListItem/EntryListItem';

function EntryList(props) {
  return (
    <div className="listView">
      {
        props.entries.map(entry => (
          <EntryListItem
            entry={entry}
            key={entry._id}
            onDelete={() => props.handleDeleteEntry(entry._id)}
          />
        ))
      }
    </div>
  );
}

EntryList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
  handleDeleteEntry: PropTypes.func.isRequired,
};

export default EntryList;
