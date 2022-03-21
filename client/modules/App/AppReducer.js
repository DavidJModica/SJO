// Import Actions
import { ADD_USER_PROPS, LOGGED_OUT } from './AppActions';

// Initial State
const initialState = {
  user: null,
  token: null,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_PROPS:
      return {
        user: action.user,
        token: action.token,
      };
    case LOGGED_OUT:
      return {
        user: null,
        token: null,
      };

    default:
      return state;
  }
};

// Export Reducer
export default AppReducer;
