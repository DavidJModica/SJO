import { browserHistory } from 'react-router';
import { Cookies } from 'react-cookie';

// Export Constants
export const TOGGLE_ADD_ENTRY = 'TOGGLE_ADD_ENTRY';
export const ADD_USER_PROPS = 'ADD_USER_PROPS';
export const LOGGED_OUT = 'LOGGED_OUT';

// Export Actions
export function loggedOut() {
  return {
    type: LOGGED_OUT,
  };
}

export function addUserProps(user, token) {
  return {
    type: ADD_USER_PROPS,
    user,
    token,
  }
}

export function logOutRequest() {
  return (dispatch) => {
    const cookies = new Cookies();
    cookies.remove('sales-journal-token', { path: '/' }); // TODO: Move cookie name to config file
    dispatch(loggedOut);
    browserHistory.push('/auth/login');
  };
}
