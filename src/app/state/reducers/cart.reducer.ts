import { createReducer, on } from '@ngrx/store';
import { Product, ProductInCart } from 'src/app/interfaces/interface';
import {
  addProductToCart,
  removeProductFromCart,
  addNewProductToCart,
  removeOneProductFromCart,
} from '../actions/cart.actions';

export interface CartState {
  products: ProductInCart[];
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

  on(addNewProductToCart, (state, { product }) => ({
    products: [
      ...state.products,
      { ...product, cant: 1, subTotal: product.price },
    ],
    cant: state.cant + 1,
    total: state.total + product.price,
  })),

  on(addProductToCart, (state, { product }) => ({
    ...state,
    cant: state.cant + 1,
    total: state.total + product.price,
    products: state.products.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          cant: p.cant + 1,
          subTotal: p.subTotal + p.price,
        };
      }
      return p;
    }),
  })),

  on(removeProductFromCart, (state, { product }) => ({
    ...state,
    cant: state.cant - 1,
    total: state.total - product.price,
    products: state.products.filter((p) => p.id !== product.id),
  })),

  on(removeOneProductFromCart, (state, { product }) => ({
    ...state,
    cant: state.cant - 1,
    total: state.total - product.price,
    products: state.products.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          cant: p.cant - 1,
          subTotal: p.subTotal - p.price,
        };
      }
      return p;
    }),
  }))
);

export function cartReducer(state, action) {
  return _cartReducer(state, action);
}
