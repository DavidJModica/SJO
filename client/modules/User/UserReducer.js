import {
  ADD_USERS,
  ADD_ENTRY_COUNTS
} from './UserActions';

// Initial State
const initialState = {
  data: []
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USERS :
      return {
        ...state,
        data: action.users,
      };

    case ADD_ENTRY_COUNTS :
      return {
        ...state,
        data: state.data.map((user) => {
          let entries = action.counts.filter(count => count._id == user._id);
          entries = entries.length ? entries[0].count : 0;

          return {
            ...user,
            entries
          }
        }),
      };

    default:
      return state;
  }
};

export const getUsers = state => state.users.data;

export default UserReducer;
