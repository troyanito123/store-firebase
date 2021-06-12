import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Product } from '../interfaces/interface';
import { User, userRole } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { AppState } from '../state/app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;

  products: Product[] = [];
  productWithPromotion: Product[] = [];

  uiSubs: Subscription;
  productSubs: Subscription;
  promotionSubs: Subscription;

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
  }

  ngOnDestroy() {
    this.uiSubs?.unsubscribe();
    this.productSubs?.unsubscribe();
    this.productSubs?.unsubscribe();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  get isAdmin() {
    return this.user?.role === userRole.admin;
  }
}
