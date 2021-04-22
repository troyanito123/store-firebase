import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/interface';
import { ImageItem } from 'src/app/models/imageItem';
import { CameraService } from 'src/app/services/camera.service';
import { ProductUniqueService } from 'src/app/utils/product-unique.service';
import { ValidatorService } from 'src/app/utils/validator.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  @Input() product: Product;

  productForm: FormGroup;

  units: string[] = ['UNIDAD', 'KILOGRAMO', 'LIBRA'];
  imageList: ImageItem[] = [];

  productsSubs: Subscription;
  imagesSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private productUniqueService: ProductUniqueService,
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    this.createForm();
    this.imageList = this.cameraService.imageList;
    this.imagesSubs = this.cameraService.imageList$.subscribe(
      (list) => (this.imageList = list)
    );
  }

  ngOnDestroy(): void {
    this.productsSubs?.unsubscribe();
    this.imagesSubs?.unsubscribe();
  }

  async saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if (this.product) {
      this.productService
        .update(this.product.id, this.productForm.value)
        .then((resp) => {
          console.log(resp);
          this.router.navigate(['/tabs/settings/products']);
        });
    } else {
      const images = await this.createBlobImages();
      this.productService
        .create(this.productForm.value, images)
        .then((resp) => {
          this.cameraService.cleanAllImagesFromList();
          this.router.navigate(['/tabs/settings/products']);
        })
        .catch((err) => console.log(err));
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
