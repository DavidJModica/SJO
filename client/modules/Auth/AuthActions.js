import callApi from '../../util/apiCaller';
import { browserHistory } from 'react-router';
import { Cookies } from 'react-cookie';

// Export Constants
export const SIGNED_UP = 'SIGNED_UP';
export const SIGNED_UP_ERROR = 'SIGNED_UP_ERROR';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR';
export const LOGGED_OUT = 'LOGGED_OUT';
export const RESTORED_SESSION = 'RESTORED_SESSION';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';

// Export Actions
export function signedUp(user, token) {
  return {
    type: SIGNED_UP,
    user,
    token,
  };
}

export function signedUpError(errorMessage) {
  return {
    type: SIGNED_UP_ERROR,
    errorMessage,
  }
}

export function loggedIn(user, token) {
  return {
    type: LOGGED_IN,
    user,
    token,
  };
}

export function loggedInError(errorMessage) {
  return {
    type: LOGGED_IN_ERROR,
    errorMessage,
  }
}

export function restoredSession(token) {
  return {
    type: RESTORED_SESSION,
    token,
  };
}

export function forgotPassword(message) {
  return {
    type: FORGOT_PASSWORD,
    message,
  }
}

export function forgotPasswordError(errorMessage) {
  return {
    type: FORGOT_PASSWORD_ERROR,
    errorMessage,
  }
}

export function resetPassword(message) {
  return {
    type: RESET_PASSWORD,
    message,
  }
}

export function resetPasswordError(errorMessage) {
  return {
    type: RESET_PASSWORD_ERROR,
    errorMessage,
  }
}

export function signUpRequest(user) {
  return (dispatch) => {
    return callApi('auth/signup', {method: 'post', body: user})
    .then(res => {
      if (res.user) {
        const cookies = new Cookies();
        cookies.set('sales-journal-token', res.token, { path: '/', maxAge: 86400 });
        dispatch(signedUp(res.user, res.token));
        browserHistory.push('/entries');
      } else {
        return dispatch(signedUpError(res.errorMessage));
      }
    });
  };
}

export function logInRequest(user) {
  return (dispatch) => {
    return callApi('auth/login', {method: 'post', body: user})
    .then(res => {
      if(res.user) {
        const cookies = new Cookies();
        cookies.set('sales-journal-token', res.token, { path: '/', maxAge: 86400 });
        dispatch(loggedIn(res.user, res.token));
        browserHistory.push('/entries');
      } else {
        return dispatch(loggedInError(res.errorMessage));
      }
    });
  };
}

export function forgotPasswordRequest(email) {
  return (dispatch) => {
    return callApi(`auth/forgot-password`, { method: 'post', body: email })
    .then(res => {
      if(res.message) {
        dispatch(forgotPassword(res.message));
      } else {
        dispatch(forgotPasswordError(res.errorMessage));
      }
    });
  };
}

export function resetPasswordRequest(resetToken, password, verifyPassword) {
  return (dispatch) => {
    const body = {
      resetToken,
      password,
      verifyPassword
    }
    return callApi(`auth/reset-password`, { method: 'post', body })
    .then(res => {
      if(res.message) {
        dispatch(resetPassword(res.message));
        browserHistory.push('/auth/login');
      } else {
        dispatch(resetPasswordError(res.errorMessage));
      }
    });
  };
}
