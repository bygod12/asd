import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: AngularFireStorage) { }
  uploadImage(image: File, clientId: string | undefined): Promise<string> {
    const filePath = `images/${clientId}/${image.name}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.put(image).then(() => {
      return fileRef.getDownloadURL().toPromise();
    });
  }
  getImagesByClient(clientId: string): Promise<string[]> {
    const folderPath = `images/${clientId}`;
    const folderRef = this.storage.ref(folderPath);

    return folderRef.listAll().toPromise().then(result => {
      const downloadUrls: string[] = [];

      result!.items.forEach(async itemRef => {
        const downloadUrl = await itemRef.getDownloadURL();
        downloadUrls.push(downloadUrl);
      });

      return downloadUrls;
    });
  }
  uploadBackground(image: File, clientId: string | undefined): Promise<string> {
    const filePath = `background/${clientId}/${image.name}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.put(image).then(() => {
      return fileRef.getDownloadURL().toPromise();
    });
  }
  getBackgroundByClient(clientId: string): Promise<string[]> {
    const folderPath = `background/${clientId}`;
    const folderRef = this.storage.ref(folderPath);

    return folderRef.listAll().toPromise().then(result => {
      const downloadUrls: string[] = [];

      result!.items.forEach(async itemRef => {
        const downloadUrl = await itemRef.getDownloadURL();
        downloadUrls.push(downloadUrl);
      });

      return downloadUrls;
    });
  }



}
