import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FotoService {


    constructor(private http: HttpClient) { }

    message: string="";
    retrievedImage: any;
    base64Data: any;
    retrieveResonse: any;

    private urlApiFoto: string = 'http://localhost:5000/image';

    onUpload(selectedFile: File) {
        const uploadImageData = new FormData();
        uploadImageData.append('imageFile', selectedFile, selectedFile.name);
        this.http.post(this.urlApiFoto + "/upload", uploadImageData, { observe: 'response' })
            .subscribe((response) => {
                if (response.status === 200) {
                    this.message = 'Imagen Guardada Correctamente';
                } else {
                    this.message = 'Imagen No Guardada Correctamente';
                }
            }
            );
    }

    // Cargar IMAGEN
    getImage(cap_cedula: string) {
        this.http.get(this.urlApiFoto + "/get/"+ cap_cedula)
            .subscribe(
                res => {
                    this.retrieveResonse = res;
                    this.base64Data = this.retrieveResonse.picByte;
                    this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
                }
            );
    }

}