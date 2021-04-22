import { EventEmitter, Injectable } from '@angular/core';
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraOptions,
  CameraPhoto,
} from '@capacitor/core';
import { ImageItem } from '../models/imageItem';
const { Camera } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private _imagesList: ImageItem[] = [];

  imageList$: EventEmitter<ImageItem[]> = new EventEmitter();
  get imageList() {
    return [...this._imagesList];
  }

  constructor() {}

  async takePicture() {
    const image = await this.processImage(CameraSource.Camera);
    const id = Date.now().toPrecision();
    this._imagesList.push(new ImageItem(id, image));
    this.emitChanges();
  }

  async chooseGallery() {
    const image = await this.processImage(CameraSource.Photos);
    const id = Date.now().toPrecision();
    this._imagesList.push(new ImageItem(id, image));
    this.emitChanges();
  }

  removeImageFromList(id: string) {
    this._imagesList = this._imagesList.filter((i) => i.id !== id);
    this.emitChanges();
  }

  cleanAllImagesFromList() {
    this._imagesList = [];
    this.emitChanges();
  }

  private emitChanges() {
    this.imageList$.emit(this._imagesList);
  }

  private async processImage(source: CameraSource) {
    const opts: CameraOptions = {
      source,
      resultType: CameraResultType.Uri,
      allowEditing: false,
      quality: 50,
      correctOrientation: true,
      height: 150,
      width: 150,
    };
    return await Camera.getPhoto(opts);
  }
}
