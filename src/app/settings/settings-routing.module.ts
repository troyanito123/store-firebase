import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsListComponent } from './pages/settings-list/settings-list.component';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    children: [
      { path: 'list', component: SettingsListComponent },
      {
        path: 'products',
        loadChildren: () =>
          import('../products/products.module').then(
            (m) => m.ProductsPageModule
          ),
      },
      {
        path: 'dealers',
        loadChildren: () =>
          import('../dealers/dealers.module').then((m) => m.DealersPageModule),
      },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
