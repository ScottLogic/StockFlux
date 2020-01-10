import ActionType from './Action';

export const initialState = {
  watchlist: false,
  addToWatchlist: false,
  news: false
};

export default (state, { type, payload }) => {
  switch (type) {
    case ActionType.SET_WATCHLIST_WINDOW:
      return {
        ...state,
        watchlist: payload
      };
    case ActionType.SET_NEWS_WINDOW:
      return {
        ...state,
        news: payload
      };
    case ActionType.RESET:
      return initialState;
    default:
      throw new Error();
  }
};
