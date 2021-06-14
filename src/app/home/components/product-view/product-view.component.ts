import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Product, ProductInCart } from 'src/app/interfaces/interface';
import {
  addNewProductToCart,
  addProductToCart,
  removeOneProductFromCart,
  removeProductFromCart,
} from 'src/app/state/actions/cart.actions';
import { AppState } from 'src/app/state/app.reducer';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  @Input() product: Product;

  productsInCart: ProductInCart[] = [];
  productsInCartSub: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.productsInCartSub = this.store
      .select('cart')
      .subscribe(({ products }) => (this.productsInCart = products));
  }

  addToCart() {
    const existProduct = this.productsInCart.find(
      (p) => p.id === this.product.id
    );
    if (existProduct) {
      this.store.dispatch(
        addProductToCart({ product: this.product as ProductInCart })
      );
    } else {
      this.store.dispatch(
        addNewProductToCart({ product: this.product as ProductInCart })
      );
    }
  }

  removeFromCart() {
    const existProduct = this.productsInCart.find(
      (p) => p.id === this.product.id
    );
    if (!existProduct) {
      return;
    }
    if (existProduct.cant === 1) {
      this.store.dispatch(
        removeProductFromCart({ product: this.product as ProductInCart })
      );
    } else {
      this.store.dispatch(
        removeOneProductFromCart({
          product: this.product as ProductInCart,
        })
      );
    }
  }
}
