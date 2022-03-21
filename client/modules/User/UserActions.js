import callApi from '../../util/apiCaller';
import { browserHistory } from 'react-router';

// Export Constants
export const ADD_USERS = 'ADD_USERS';
export const ADD_ENTRY_COUNTS = 'ADD_ENTRY_COUNTS';

// Export Actions
export function addUsers(users) {
  return {
    type: ADD_USERS,
    users,
  };
}

export function addEntryCounts(counts) {
  return {
    type: ADD_ENTRY_COUNTS,
    counts,
  };
}

export function fetchUsersWithUserCount(token) {
  return (dispatch) => {
    return callApi('users', {token}).then(res => {
      if(res.users) {
        dispatch(addUsers(res.users));
        return callApi('users/getUsersWithEntryCount', {token}).then(res => {
          if(res.result) {
            dispatch(addEntryCounts(res.result));
          } else {
            // TODO: dispatch error message
            // TODO: If error is unauth, redirect to login
            return { data: [], }
          }
        });
      } else {
        // TODO: dispatch error message
        // TODO: If error is unauth, redirect to login
        return { data: [], }
      }
    });
  };
}
