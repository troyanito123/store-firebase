import { createAction, props } from '@ngrx/store';
import { Product, ProductInCart } from 'src/app/interfaces/interface';

export const addNewProductToCart = createAction(
  '[Cart] Add new product to cart',
  props<{ product: ProductInCart }>()
);

export const addProductToCart = createAction(
  '[Cart] Add product to cart',
  props<{ product: ProductInCart }>()
);

export const removeProductFromCart = createAction(
  '[Cart] remove producto from cart',
  props<{ product: ProductInCart }>()
);

export const removeOneProductFromCart = createAction(
  '[Cart] remove one producto from cart',
  props<{ product: ProductInCart }>()
);

export const clearCart = createAction('[Cart] Clear cart');
