import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const fileSizeMax = 1 * 1024 * 1024
const widthHeightMax = 1024
const defaultWidthHeightRatio = 1
const defaultQualityRatio = 0.7
@Injectable({
  providedIn: 'root',
})
export class SharedServices {
  private url = environment.baseUrl;
  private status = new BehaviorSubject<any[]>([
    { style: 'color:#8A5340; background-color: #FEEDAF;', name: 'Pendiente' },
    { style: 'color:#C63737; background-color: #FFCDD2;', name: 'Rechazado'},
    { style: 'color:#694382; background-color: #ECCFFF; ', name: 'Recibido' },
    { style: 'color:#23547B; background-color: #B3E5FC;', name: 'En control' },
    { style: 'color:#256029; background-color: #C8E6C9;', name: 'Aceptado' },
    { style: 'color:#805B36; background-color: #FFD8B2;', name: 'Devuelto' },
    { style: 'color:#1F2430; background-color: #CCCAC2;', name: 'Cancelado', inactive: true },
  ]);
  private stock = new BehaviorSubject<any[]>([
    { style: 'color:#8A5340; background-color: #FEEDAF;', name: 'LOWSTOCK' },
    { style: 'color:#C63737; background-color: #FFCDD2;', name: 'OUTOFSTOCK' },
    { style: 'color:#256029; background-color: #C8E6C9;', name: 'INSTOCK' },
  ]);
  status$ = this.status.asObservable();


  constructor (private http: HttpClient) {
   }

  addimage(file: File, folder: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('folder', folder);
    return this.http.post(`${this.url}/upload-image`, formData, {
      responseType: 'text',
      params: params,
    });
  }
  compress(file: File): Observable<File> {
    const imageType = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return Observable.create((observer:any) => {
      reader.onload = (ev) => {
        const img = this.createImage(ev);
        const imgWH = img.width > img.height ? img.width : img.height;
        let withHeightRatio = imgWH > widthHeightMax
            ? widthHeightMax / imgWH
            : defaultWidthHeightRatio;
        let qualityRatio =
          file.size > fileSizeMax
            ? fileSizeMax / file.size
            : defaultQualityRatio;
        img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = img.width * withHeightRatio;
          elem.height = img.height * withHeightRatio;
          const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
          ctx.drawImage(img, 0, 0, elem.width, elem.height);
          ctx.canvas.toBlob(
            (blob:any) => {
              observer.next(
                new File([blob], file.name, {
                  type: imageType,
                  lastModified: Date.now(),
                })
              );
            },
            imageType,
            qualityRatio
          );
        };
      };
      reader.onerror = (error) => observer.error(error);
    });
  }

  private createImage(ev:any) {
    let imageContent = ev.target.result;
    const img = new Image();
    img.src = imageContent;
    return img;
  }
}
        // const file = event.target.files[0];
        // console.log(`Image size before compressed: ${file.size} bytes.`);
        // this.sharedServices
        //   .compress(file)
        //   .pipe(take(1))
        //   .subscribe((compressedImage) => {
        //     console.log(
        //       `Image size after compressed: ${compressedImage.size} bytes.`
        //     );

        //   });