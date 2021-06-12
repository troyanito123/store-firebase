import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageItem } from 'src/app/models/imageItem';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-product-new-images',
  templateUrl: './product-new-images.component.html',
  styleUrls: ['./product-new-images.component.scss'],
})
export class ProductNewImagesComponent implements OnInit, OnDestroy {
  imageList: ImageItem[] = [];
  imageListSubs: Subscription;

  constructor(private cameraService: CameraService) {}

  ngOnInit() {
    this.imageList = this.cameraService.imageList;
    this.imageListSubs = this.cameraService.imageList$.subscribe((list) => {
      this.imageList = list;
    });
  }

  ngOnDestroy() {
    this.imageListSubs?.unsubscribe();
  }

  takePicture() {
    this.cameraService.takePicture();
  }

  chooseFromGallery() {
    this.cameraService.chooseGallery();
  }

  removeImage(id: string) {
    this.cameraService.removeImageFromList(id);
  }
}
