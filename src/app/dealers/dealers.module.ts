import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealersPageRoutingModule } from './dealers-routing.module';

import { DealersPage } from './dealers.page';
import { DealerListComponent } from './pages/dealer-list/dealer-list.component';
import { DealerNewComponent } from './pages/dealer-new/dealer-new.component';
import { DealerComponent } from './pages/dealer/dealer.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DealersPageRoutingModule],
  declarations: [
    DealersPage,
    DealerListComponent,
    DealerNewComponent,
    DealerComponent,
  ],
})
export class DealersPageModule {}
