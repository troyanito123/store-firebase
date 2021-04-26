import { Component, Input, OnInit } from '@angular/core';
import { Image } from 'src/app/interfaces/interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss'],
})
export class ProductImagesComponent implements OnInit {
  @Input()
  images: Image[];

  @Input()
  productId: string;

  constructor(private productService: ProductService) {}

  ngOnInit() {}

  removeImage(image: Image) {
    if (this.images.length === 1) {
      console.log('debes tener por lo menos una images');
      return;
    }
    this.productService.removeImageById(this.productId, image).then(() => {
      this.images = this.images.filter((i) => i.id !== image.id);
    });
  }
}
