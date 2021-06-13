import { createReducer, on } from '@ngrx/store';
import { Product } from 'src/app/interfaces/interface';
import { User } from 'src/app/models/user';
import { setUser, unsetUser } from '../actions/auth.actions';
import {
  addProductToCart,
  removeProductFromCart,
} from '../actions/cart.actions';

export interface CartState {
  products: Product[];
  cant: number;
  total: number;
}

export const initialCartState: CartState = {
  products: [],
  cant: 0,
  total: 0,
};

const _cartReducer = createReducer(
  initialCartState,

  on(addProductToCart, (state, { product }) => ({
    products: [...state.products, product],
    cant: state.cant + 1,
    total: state.total + product.price,
  })),

  on(removeProductFromCart, (state, { product }) => ({
    ...state,
    cant: state.cant - 1,
    total: state.total - product.price,
    products: state.products.filter((p) => p.id !== product.id),
  }))
);

export function carReducer(state, action) {
  return _cartReducer(state, action);
}
