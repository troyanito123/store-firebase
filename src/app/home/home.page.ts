import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../state/app.reducer';
import * as cartActions from '../state/actions/cart.actions';

import { User, userRole } from '../models/user';
import { Product, ProductInCart } from '../interfaces/interface';

import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;

  products: Product[] = [];
  productWithPromotion: Product[] = [];
  productsInCart: ProductInCart[] = [];

  uiSubs: Subscription;
  productSubs: Subscription;
  promotionSubs: Subscription;
  productsInCartSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.uiSubs = this.store.select('auth').subscribe(({ user }) => {
      this.user = user;
    });

    this.productSubs = this.productService
      .getProductForHome()
      .subscribe((products) => {
        this.products = products;
      });
    this.productSubs = this.productService
      .getProductWithPromotion()
      .subscribe((promotion) => {
        this.productWithPromotion = promotion;
      });

    this.productsInCartSubs = this.store
      .select('cart')
      .subscribe(({ cant, products, total }) => {
        this.productsInCart = products;
      });
  }

  ngOnDestroy() {
    this.uiSubs?.unsubscribe();
    this.productSubs?.unsubscribe();
    this.productSubs?.unsubscribe();
    this.productsInCartSubs?.unsubscribe();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  get isAdmin() {
    return this.user?.role === userRole.admin;
  }

  addToCart(product: Product) {
    const existProduct = this.productsInCart.find((p) => p.id === product.id);
    if (existProduct) {
      this.store.dispatch(
        cartActions.addProductToCart({ product: product as ProductInCart })
      );
    } else {
      this.store.dispatch(
        cartActions.addNewProductToCart({ product: product as ProductInCart })
      );
    }
  }

  removeFromCart(product: Product) {
    const existProduct = this.productsInCart.find((p) => p.id === product.id);
    if (!existProduct) {
      return;
    }
    if (existProduct.cant === 1) {
      this.store.dispatch(
        cartActions.removeProductFromCart({ product: product as ProductInCart })
      );
    } else {
      this.store.dispatch(
        cartActions.removeOneProductFromCart({
          product: product as ProductInCart,
        })
      );
    }
  }
}
