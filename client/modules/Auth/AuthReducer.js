import {
  SIGNED_UP,
  SIGNED_UP_ERROR,
  LOGGED_IN,
  LOGGED_IN_ERROR,
  LOGGED_OUT,
  RESTORED_SESSION,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_ERROR
} from './AuthActions';

// Initial State
const initialState = {
  user: null,
  token: null,
  errorMessage: null,
  message: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNED_UP :
      return {
        user: action.user,
        token: action.token,
      };
    case SIGNED_UP_ERROR :
      return {
        errorMessage: action.errorMessage,
      };
    case LOGGED_IN :
      return {
        user: action.user,
        token: action.token,
      };
    case LOGGED_IN_ERROR :
      return {
        errorMessage: action.errorMessage,
      };
    case LOGGED_OUT :
      return {
        user: null,
      };
    case RESTORED_SESSION :
      return {
        token: action.token,
      };
    case FORGOT_PASSWORD :
      return {
        message: action.message,
      };
    case FORGOT_PASSWORD_ERROR :
      return {
        errorMessage: action.errorMessage
      };
    case RESET_PASSWORD :
      return {
        message: action.message,
      }
    case RESET_PASSWORD_ERROR :
      return {
        errorMessage: action.errorMessage,
      }

    default:
      return state;
  }
};

/* Selectors */

// Get all entries
export const getUser = state => state.auth.user;

export const getToken = state => state.auth.token;

export const getErrorMessage = state => state.auth.errorMessage;

export const getMessage = state => state.auth.message;

// Export Reducer
export default AuthReducer;
