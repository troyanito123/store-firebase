import { ActionReducerMap } from '@ngrx/store';

import * as ui from './reducers/ui.reducer';
// import * as fromAuth from './auth/auth.reducer';
// import * as fromIngresoEgreso from './ingreso-egreso/ingreso-egreso.reducer';

export interface AppState {
  ui: ui.State;
  //   auth: fromAuth.AuthState;
  // ingresoEgreso: fromIngresoEgreso.IngresoEgresoState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  //   auth: fromAuth.authReducer,
  // ingresoEgreso: fromIngresoEgreso.ingresoEgresoReducer
};
