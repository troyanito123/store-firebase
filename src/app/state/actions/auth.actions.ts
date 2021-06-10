import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user';

export const setUser = createAction('[AUTH] set user', props<{ user: User }>());
export const unsetUser = createAction('[AUTH] unset user');
