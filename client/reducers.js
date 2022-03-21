/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import auth from './modules/Auth/AuthReducer';
import intl from './modules/Intl/IntlReducer';
import entries from './modules/Entry/EntryReducer';
import quotes from './modules/Quote/QuoteReducer';
import users from './modules/User/UserReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  auth,
  intl,
  entries,
  quotes,
  users,
});
