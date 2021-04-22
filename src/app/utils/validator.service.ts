import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Product } from '../interfaces/interface';
import { ProductService } from '../products/services/product.service';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  private products: Product[] = [];

  constructor(private productService: ProductService) {
    this.products = productService.products;
  }

  uniqueName(field: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const name = formGroup.get(field)?.value;
      const product = this.products.find((p) => p.name === name);
      if (product) {
        formGroup.get(field)?.setErrors({ exists: true });
        return { exists: true };
      }
      return null;
    };
  }
}
