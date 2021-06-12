import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';

import { Subscription } from 'rxjs';

import { Product } from 'src/app/interfaces/interface';
import { ImageItem } from 'src/app/models/imageItem';
import { CameraService } from 'src/app/services/camera.service';
import { ProductUniqueService } from 'src/app/utils/product-unique.service';
import { ProductService } from '../../../services/product.service';
import { initLoading, stopLoading } from 'src/app/state/actions/ui.actions';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  @Input() product: Product;

  isLoading = false;

  productForm: FormGroup;

  units: string[] = ['UNIDAD', 'KILOGRAMO', 'LIBRA'];
  imageList: ImageItem[] = [];

  productsSubs: Subscription;
  imagesSubs: Subscription;
  uiSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private productUniqueService: ProductUniqueService,
    private cameraService: CameraService,
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.createForm();
    this.imageList = this.cameraService.imageList;
    this.imagesSubs = this.cameraService.imageList$.subscribe(
      (list) => (this.imageList = list)
    );
    this.uiSubs = this.store.select('ui').subscribe(({ isLoading }) => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy(): void {
    this.productsSubs?.unsubscribe();
    this.imagesSubs?.unsubscribe();
    this.uiSubs?.unsubscribe();
  }

  async saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(initLoading());
    const images = await this.createBlobImages();
    if (this.product) {
      this.productService
        .update(this.product.id, this.productForm.value, images)
        .then(async (resp) => {
          const toast = await this.utilsService.createToast(
            'Producto actualizado'
          );
          this.store.dispatch(stopLoading());
          this.cameraService.cleanAllImagesFromList();
          this.router
            .navigate(['/tabs/settings/products'])
            .then(() => toast.present());
        })
        .catch(async (err) => {
          const alert = await this.utilsService.createAlert(err.message);
          alert.present();
        });
    } else {
      if (images.length == 0) {
        const alert = await this.utilsService.createAlert(
          'Tiene que existir al menos una imagen'
        );
        alert.present();
        this.store.dispatch(stopLoading());
        return;
      }
      this.productService
        .create(this.productForm.value, images)
        .then(async (resp) => {
          const toast = await this.utilsService.createToast(
            'Nuevo producto creado'
          );
          this.store.dispatch(stopLoading());
          this.cameraService.cleanAllImagesFromList();
          this.router
            .navigate(['/tabs/settings/products'])
            .then(() => toast.present());
        })
        .catch(async (err) => {
          const alert = await this.utilsService.createAlert(err.message);
          alert.present();
        });
    }
  }

  private createForm() {
    this.productForm = this.fb.group({
      name: [
        this.product ? this.product.name : '',
        [Validators.required, Validators.minLength(2)],
        [this.productUniqueService],
      ],
      description: [
        this.product ? this.product.description : '',
        [Validators.required, Validators.minLength(2)],
      ],
      price: [
        this.product ? Number(this.product.price) : 1.0,
        [Validators.required, Validators.min(1), Validators.max(9999)],
      ],
      stock: [
        this.product ? Number(this.product.stock) : 10,
        [Validators.required, Validators.min(1), Validators.max(9999)],
      ],
      promotion: [
        this.product ? this.product.promotion : false,
        Validators.required,
      ],
      available: [
        this.product ? this.product.available : true,
        Validators.required,
      ],
      unit: [
        this.product
          ? this.units.find((u) => u === this.product.unit)
          : this.units[0],
        [Validators.required],
      ],
    });
  }

  invalidField(field: string) {
    return (
      this.productForm.get(field).invalid && this.productForm.get(field).touched
    );
  }

  get invalidNameMsg(): string {
    const errors = this.productForm.get('name').errors;
    if (errors?.required) {
      return 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      return 'Nombre debe contener minimo 2 caracters';
    } else if (errors?.unique) {
      return 'Ya existe un producto con este nombre';
    }
    return '';
  }

  get invalidDescriptionMsg(): string {
    const errors = this.productForm.get('description').errors;
    if (errors?.required) {
      return 'Descripcion es obligatorio';
    } else if (errors?.minlength) {
      return 'Descripcion debe contener minimo 2 caracters';
    }
    return '';
  }

  get invalidPriceMsg(): string {
    const errors = this.productForm.get('price').errors;
    if (errors?.required) {
      return 'Precio es obligatorio';
    } else if (errors?.min) {
      return 'Precio debe ser minimo de 1';
    } else if (errors?.max) {
      return 'Precio debe ser maximo de 9999';
    }
    return '';
  }

  get invalidStockMsg(): string {
    const errors = this.productForm.get('stock').errors;
    if (errors?.required) {
      return 'Stock es obligatorio';
    } else if (errors?.min) {
      return 'Stock debe ser minimo de 10';
    } else if (errors?.max) {
      return 'Stock debe ser maximo de 9999';
    }
    return '';
  }

  private async createBlobImages() {
    const images = [];
    for (const item of this.imageList) {
      const blob = await fetch(item.image.webPath).then((r) => r.blob());
      images.push(blob);
    }
    return images;
  }
}
