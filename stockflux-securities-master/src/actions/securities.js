import { FetchState } from '../enums';

export const fetching = () => ({
  type: FetchState.FETCHING
});

export const updating = () => ({
  type: FetchState.UPDATING
});

export const error = () => ({
  type: FetchState.ERROR
});

export const success = securities => ({
  type: FetchState.SUCCESS,
  payload: securities
});
