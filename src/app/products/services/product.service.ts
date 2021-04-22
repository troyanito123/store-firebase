import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from 'src/app/interfaces/interface';

import { catchError, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _products: Product[] = [];

  _product: Product;

  get product() {
    return { ...this._product };
  }

  get products() {
    return [...this._products];
  }

  constructor(private db: AngularFireDatabase) {}

  getAll() {
    return this.db
      .list<Product>('products')
      .snapshotChanges()
      .pipe(
        map(
          (res: any[]) =>
            res.map((r) => ({ id: r.key, ...r.payload.val() })) as Product[]
        ),
        tap((products) => (this._products = products))
      );
  }

  create(product: Product) {
    product.createdAt = new Date().getDate().toPrecision();
    product.updatedAt = new Date().getDate().toPrecision();
    return this.db.list('products').push(product).get();
  }

  getOne(id: string) {
    console.log();
    return this.db
      .object<Product>(`products/${id}`)
      .valueChanges()
      .pipe(
        take(1),
        tap((res) => this.changeProductAndEmitt(res))
      );
  }

  update(id: string, product: Product) {
    product.updatedAt = new Date().getDate().toPrecision();
    return this.db.list('products').update(id, product);
  }

  resetProduct() {
    this._product = null;
  }

  private changeProductAndEmitt(product: Product) {
    this._product = product;
  }

  existsProduct(field: string) {
    return this.db
      .list<Product>('products')
      .valueChanges()
      .pipe(
        take(1),
        map((products) =>
          products.find((p) => p.name === field) ? true : false
        ),
        catchError((err) => of(false))
      );
  }
}
