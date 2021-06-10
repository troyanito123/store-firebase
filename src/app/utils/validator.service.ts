import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Product } from '../interfaces/interface';
import { ProductService } from '../products/services/product.service';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  private products: Product[] = [];

  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(private productService: ProductService) {
    // this.products = productService.products;
  }

  // uniqueName(field: string) {
  //   return (formGroup: AbstractControl): ValidationErrors | null => {
  //     const name = formGroup.get(field)?.value;
  //     const product = this.products.find((p) => p.name === name);
  //     if (product) {
  //       formGroup.get(field)?.setErrors({ exists: true });
  //       return { exists: true };
  //     }
  //     return null;
  //   };
  // }

  sameFields(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass1 = formGroup.get(field1)?.value;
      const pass2 = formGroup.get(field2)?.value;

      if (pass1 !== pass2) {
        formGroup.get(field2)?.setErrors({ noSame: true });
        return { noSame: true };
      }

      formGroup.get(field2)?.setErrors(null);

      return null;
    };
  }
}
