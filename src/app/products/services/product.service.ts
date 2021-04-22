import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from 'src/app/interfaces/interface';

import { catchError, finalize, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ImageItem } from 'src/app/models/imageItem';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private MEDIA_STORAGE_PATH = 'products';
  private _products: Product[] = [];

  _product: Product;

  get product() {
    return { ...this._product };
  }

  get products() {
    return [...this._products];
  }

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

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

  create(product: Product, images?: Blob[]) {
    product.createdAt = Date.now().toPrecision();
    product.updatedAt = Date.now().toPrecision();

    return this.db
      .list(this.MEDIA_STORAGE_PATH)
      .push(product)
      .then((ref) => {
        const imagesRef = this.db.list(
          `${this.MEDIA_STORAGE_PATH}/${ref.key}/images`
        );
        for (const item of images) {
          const filePath = this.generateFileName(
            `${Date.now().toPrecision()}-no-name`
          );
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, item);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((res) => {
                  imagesRef.push(res);
                });
              })
            )
            .subscribe();
        }
      });
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

  private generateFileName(name: string): string {
    return `${this.MEDIA_STORAGE_PATH}/${new Date().getTime()}_${name}`;
  }
}
