import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { OnReducer } from '@ngrx/store/src/reducer_creator';
import { Subscription } from 'rxjs';
import { Product, ProductInCart } from '../interfaces/interface';
import { AppState } from '../state/app.reducer';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cartSubs: Subscription;

  products: ProductInCart[] = [];
  cant = 0;
  total = 0;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.cartSubs = this.store
      .select('cart')
      .subscribe(({ cant, products, total }) => {
        this.products = products;
        this.cant = cant;
        this.total = total;
      });
  }

  ngOnDestroy() {
    this.cartSubs?.unsubscribe();
  }
}
