import ActionType from './Action';

export const initialState = {
  chart: false,
  news: false
};

export default (state, { type, payload }) => {
  switch (type) {
    case ActionType.SET_CHART_WINDOW:
      return {
        ...state,
        chart: payload
      };
    case ActionType.SET_NEWS_WINDOW:
      return {
        ...state,
        news: payload
      };
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
