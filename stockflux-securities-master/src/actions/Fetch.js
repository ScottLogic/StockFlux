import { FetchState } from '../enums';

export const fetching = () => ({
  type: FetchState.FETCHING
});

export const success = securities => ({
  type: FetchState.SUCCESS,
  payload: securities
});

export const error = () => ({
  type: FetchState.ERROR
});
