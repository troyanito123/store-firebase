import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { SettingsListComponent } from './pages/settings-list/settings-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SettingsPageRoutingModule],
  declarations: [SettingsPage, SettingsListComponent],
})
export class SettingsPageModule {}
