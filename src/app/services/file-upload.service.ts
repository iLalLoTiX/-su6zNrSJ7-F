import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(public http : HttpClient) { }

  async actualizarFoto(
    archivo: File,
    tipo: 'empleados' | 'usuarios',
    id: string
  ){
    try {

      const url = `${base_url}/cargar/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      return this.http.put(url, formData).toPromise();
      
    } catch (error) {
      console.log(error);
      return false
    }
  }
}
