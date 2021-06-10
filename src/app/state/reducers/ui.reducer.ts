import { createReducer, on } from '@ngrx/store';
import { initLoading, stopLoading } from '../actions/ui.actions';

export interface State {
  isLoading: boolean;
}

export const initialState: State = {
  isLoading: false,
};

const _uiReducer = createReducer(
  initialState,

  on(initLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false }))
);

export function uiReducer(state, action) {
  return _uiReducer(state, action);
}
