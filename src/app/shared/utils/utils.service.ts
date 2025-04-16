import { Injectable } from '@angular/core';
import {
  ToastController,
  ToastOptions,
  LoadingController,
  LoadingOptions,

} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) { }


  //======= Toast Controller ===============

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

    //================ LOADING  ========

  //Present ==
  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingCtrl.create(opts);

    await loading.present();
  }
  // Dismiss ==
  async dismissLoading() {
    return await this.loadingCtrl.dismiss();
  }


}
