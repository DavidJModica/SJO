import callApi from '../../util/apiCaller';
import { browserHistory } from 'react-router';

// Export Constants
export const SET_RANDOM_QUOTE = 'SET_RANDOM_QUOTE';
export const ADD_QUOTE = 'ADD_QUOTE';
export const ADD_QUOTES = 'ADD_QUOTES';
export const DELETE_QUOTE = 'DELETE_QUOTE';
export const UPDATE_QUOTE = 'UPDATE_QUOTE';
export const UPDATE_QUOTE_ERROR = 'UPDATE_QUOTE_ERROR';

// Export Actions
export function setRandomQuote(quote) {
  return {
    type: SET_RANDOM_QUOTE,
    quote,
  };
}

export function addQuote(quote) {
  return {
    type: ADD_QUOTE,
    quote,
  };
}

export function updateQuote(quote, message) {
  return {
    type: UPDATE_QUOTE,
    quote,
    message,
  };
}

export function updateQuoteError(message) {
  return {
    type: UPDATE_QUOTE_ERROR,
    message,
  }
}

export function addQuoteRequest(token) {
  return (dispatch) => {
    return callApi('quotes', {
      method: 'post',
      body: {
        quote: {
          author: '',
          text: '',
        },
      },
      token,
    }).then(res => {
      dispatch(addQuote(res.quote));
      browserHistory.push(`/admin/quotes/${res.quote._id}`);
    });
  };
}

export function addQuotes(quotes) {
  return {
    type: ADD_QUOTES,
    quotes,
  };
}

export function fetchRandomQuote(token) {
  return (dispatch) => {
    return callApi('quotes/random', {token}).then(res => {
      if (res.quote) {
        return dispatch(setRandomQuote(res.quote));
      }
    });
  }
}

export function fetchQuotes(token) {
  return (dispatch) => {
    return callApi('quotes', {token}).then(res => {
      if(res.quotes) {
        dispatch(addQuotes(res.quotes));
      } else {
        // TODO: dispatch error message
        // TODO: If error is unauth, redirect to login
        return { data: [], }
      }
    });
  };
}

export function fetchQuote(id, token) {
  return (dispatch) => {
    return callApi(`quotes/${id}`, {token}).then(res => {
      if (res.quote) {
        return dispatch(addQuote(res.quote));
      } else {
        // TODO: dispatch error message
        // TODO: If error is unauth, redirect to login
        return { data: [], }
      }
    });
  };
}

export function deleteQuote(id) {
  return {
    type: DELETE_QUOTE,
    id,
  };
}

export function deleteQuoteRequest(id, token) {
  return (dispatch) => {
    return callApi(`quotes/${id}`, {method: 'delete', token}).then(() => dispatch(deleteQuote(id)));
    // TODO: dispatch error message
    // TODO: If error is unauth, redirect to login
  };
}

export function saveQuoteRequest(quote, token) {
  return (dispatch) => {
    return callApi(`quotes/${quote._id}`, {method: 'put', body: {'quote': quote}, token}).then(res => {
      if (res.quote) {
        return dispatch(updateQuote(res.quote, 'Saved!'));
      } else {
        // TODO: If error is unauth, redirect to login
        return dispatch(updateQuoteError('Error saving quote!'));
      }
    });
  };
}
