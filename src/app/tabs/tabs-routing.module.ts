import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsAdminGuard } from '../guards/is-admin.guard';
import { IsAuthGuard } from '../guards/is-auth.guard';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('../cart/cart.module').then((m) => m.CartPageModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../orders/orders.module').then((m) => m.OrdersPageModule),
        canActivate: [IsAuthGuard],
        canLoad: [IsAuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
        canActivate: [IsAuthGuard, IsAdminGuard],
        canLoad: [IsAuthGuard, IsAdminGuard],
      },
      { path: '', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
