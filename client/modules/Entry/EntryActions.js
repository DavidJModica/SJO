import callApi from '../../util/apiCaller';
import { browserHistory } from 'react-router';

// Export Constants
export const ADD_ENTRY = 'ADD_ENTRY';
export const ADD_ENTRIES = 'ADD_ENTRIES';
export const DELETE_ENTRY = 'DELETE_ENTRY';
export const UPDATE_ENTRY = 'UPDATE_ENTRY';
export const UPDATE_ENTRY_ERROR = 'UPDATE_ENTRY_ERROR';

// Export Actions
export function addEntry(entry) {
  return {
    type: ADD_ENTRY,
    entry,
  };
}

export function updateEntry(entry, message) {
  return {
    type: UPDATE_ENTRY,
    entry,
    message,
  };
}

export function updateEntryError(message) {
  return {
    type: UPDATE_ENTRY_ERROR,
    message,
  }
}

export function addEntryRequest(token) {
  return (dispatch) => {
    return callApi('entries', {
      method: 'post',
      body: {
        entry: {
          type: 'daily',
          date: new Date(),
        },
      },
      token,
    }).then(res => {
      dispatch(addEntry(res.entry));
      browserHistory.push(`/entries/${res.entry._id}`);
    });
  };
}

export function addEntries(entries) {
  return {
    type: ADD_ENTRIES,
    entries,
  };
}

export function fetchEntries(token) {
  return (dispatch) => {
    return callApi('entries', {token}).then(res => {
      if(res.entries) {
        dispatch(addEntries(res.entries));
      } else {
        // TODO: dispatch error message
        // TODO: If error is unauth, redirect to login
        return { data: [], }
      }
    });
  };
}

export function fetchEntry(id, token) {
  return (dispatch) => {
    return callApi(`entries/${id}`, {token}).then(res => {
      if (res.entry) {
        return dispatch(addEntry(res.entry));
      } else {
        // TODO: dispatch error message
        // TODO: If error is unauth, redirect to login
        return { data: [], }
      }
    });
  };
}

export function deleteEntry(id) {
  return {
    type: DELETE_ENTRY,
    id,
  };
}

export function deleteEntryRequest(id, token) {
  return (dispatch) => {
    return callApi(`entries/${id}`, {method: 'delete', token}).then(() => dispatch(deleteEntry(id)));
    // TODO: dispatch error message
    // TODO: If error is unauth, redirect to login
  };
}

export function saveEntryRequest(entry, token) {
  return (dispatch) => {
    return callApi(`entries/${entry._id}`, {method: 'put', body: {'entry': entry}, token}).then(res => {
      if (res.entry) {
        return dispatch(updateEntry(res.entry, 'Saved!'));
      } else {
        // TODO: If error is unauth, redirect to login
        return dispatch(updateEntryError('Error saving entry!'));
      }
    });
  };
}
