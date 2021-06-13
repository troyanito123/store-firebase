import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './reducers/auth.reducer';
import { CartState, cartReducer } from './reducers/cart.reducer';

import * as ui from './reducers/ui.reducer';

export interface AppState {
  ui: ui.UiState;
  auth: AuthState;
  cart: CartState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  auth: authReducer,
  cart: cartReducer,
};
