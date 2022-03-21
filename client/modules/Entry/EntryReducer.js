import {
  ADD_ENTRY,
  ADD_ENTRIES,
  DELETE_ENTRY,
  UPDATE_ENTRY,
  UPDATE_ENTRY_ERROR
} from './EntryActions';

// Initial State
const initialState = {
  data: [],
  message: null,
  notification: false,
  notificationType: 'success'
};

const EntryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ENTRY :
      return {
        ...state,
        data: [action.entry, ...state.data],
      };

    case ADD_ENTRIES :
      return {
        ...state,
        data: action.entries,
      };

    case DELETE_ENTRY :
      return {
        ...state,
        data: state.data.filter(entry => entry._id !== action.id),
      };

    case UPDATE_ENTRY:
      return {
        data: state.data.map((entry, index) => {
          if(entry._id != action.entry._id) {
            return entry;
          }

          return {
            ...entry,
            ...action.entry,
          };
        }),
        message: action.message,
        notification: true,
        notificationType: 'success',
      };

    case UPDATE_ENTRY_ERROR:
      return {
        ...state,
        message: action.message,
        notification: true,
        notificationType: 'error',
      };

    default:
      return state;
  }
};

/* Selectors */

// Get all entries
export const getEntries = state => state.entries.data;

export const getEntry = (state, id) => state.entries.data.filter(entry => entry._id === id)[0];

export const getMessage = state => state.entries.message;

export const getNotificationState = state => state.entries.notification;

export const getNotificationType = state => state.entries.notificationType;

// Export Reducer
export default EntryReducer;
