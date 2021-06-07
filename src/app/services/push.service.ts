import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  constructor(private oneSignal: OneSignal) {}

  initialize() {
    this.oneSignal.startInit(
      'b069b4ab-7188-47f9-8dd0-425331b325f9',
      '405383394698'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.InAppAlert
    );

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      console.log('notificacion recibida', noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      console.log('notificacion ABIERTA', noti);
    });

    this.oneSignal.endInit();
  }
}
