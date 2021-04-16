import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealersPage } from './dealers.page';
import { DealerListComponent } from './pages/dealer-list/dealer-list.component';
import { DealerNewComponent } from './pages/dealer-new/dealer-new.component';
import { DealerComponent } from './pages/dealer/dealer.component';

const routes: Routes = [
  {
    path: '',
    component: DealersPage,
    children: [
      { path: 'list', component: DealerListComponent },
      { path: 'edit/:id', component: DealerComponent },
      { path: 'dealer/new', component: DealerNewComponent },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealersPageRoutingModule {}
