import {
  SET_RANDOM_QUOTE,
  ADD_QUOTE,
  ADD_QUOTES,
  DELETE_QUOTE,
  UPDATE_QUOTE,
  UPDATE_QUOTE_ERROR
} from './QuoteActions';

// Initial State
const initialState = {
  randomQuote: { text: '', author: '' },
  data: [],
  message: null,
  notification: false,
  notificationType: 'success'
};

const QuoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RANDOM_QUOTE :
      return {
        ...state,
        randomQuote: action.quote,
      };

    case ADD_QUOTE :
      return {
        ...state,
        data: [action.quote, ...state.data],
      };

    case ADD_QUOTES :
      return {
        ...state,
        data: action.quotes,
      };

    case DELETE_QUOTE :
      return {
        ...state,
        data: state.data.filter(quote => quote._id !== action.id),
      };

    case UPDATE_QUOTE:
      return {
        data: state.data.map((quote, index) => {
          if(quote._id != action.quote._id) {
            return quote;
          }

          return {
            ...quote,
            ...action.quote,
          };
        }),
        message: action.message,
        notification: true,
        notificationType: 'success',
      };

    case UPDATE_QUOTE_ERROR:
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

export const getRandomQuote = state => state.quotes.randomQuote;

export const getQuotes = state => state.quotes.data;

export const getQuote = (state, id) => state.quotes.data.filter(quote => quote._id === id)[0];

export const getMessage = state => state.quotes.message;

export const getNotificationState = state => state.quotes.notification;

export const getNotificationType = state => state.quotes.notificationType;

export default QuoteReducer;
