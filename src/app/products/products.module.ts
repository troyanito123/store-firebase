import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductNewComponent } from './pages/product-new/product-new.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProductsPageRoutingModule],
  declarations: [
    ProductsPage,
    ProductListComponent,
    ProductComponent,
    ProductNewComponent,
  ],
})
export class ProductsPageModule {}
