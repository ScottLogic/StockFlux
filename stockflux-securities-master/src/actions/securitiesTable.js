export const TABLE_LOADING = "TABLE_LOADING";
export const TABLE_UPDATING = "TABLE_UPDATING";
export const TABLE_ERROR = "TABLE_ERROR";
export const TABLE_SUCCESS = "TABLE_SUCCESS";
export const SET_SECURITIES_DATA = "SET_SECURITIES_DATA";

export const tableLoading = () => ({
  type: TABLE_LOADING
});

export const tableUpdating = () => ({
  type: TABLE_UPDATING
});

export const tableError = messages => ({
  type: TABLE_ERROR,
  messages
});

export const tableSuccess = messages => ({
  type: TABLE_SUCCESS,
  messages
});

export const setSecuritiesData = securities => ({
  type: SET_SECURITIES_DATA,
  payload: securities
});
