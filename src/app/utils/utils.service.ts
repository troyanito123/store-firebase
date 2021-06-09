import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private alertController: AlertController) {}

  createAlert(message: string) {
    return this.alertController.create({
      backdropDismiss: false,
      message,
      header: 'Ocurrio un error',
      buttons: ['Ok'],
    });
  }
}
