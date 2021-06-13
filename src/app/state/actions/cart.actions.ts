import { createAction, props } from '@ngrx/store';
import { Product } from 'src/app/interfaces/interface';

export const addProductToCart = createAction(
  '[Cart] Add product to cart',
  props<{ product: Product }>()
);
export const removeProductFromCart = createAction(
  '[Cart] remove producto from cart',
  props<{ product: Product }>()
);

export const clearCart = createAction('[Cart] Clear cart');
