import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'environments/environment';
import { Cajas } from 'app/models/cajas.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  constructor(public http : HttpClient) { }

  getCajas(){
    return this.http.get(base_url + '/cajas');
  }

  postCajas(caja){
    if(caja.inventario === null){
      caja.inventario = 0;
    }
    if(caja.rotas === null){
      caja.rotas = 0;
    }
    if(caja.perdidas === null){
      caja.perdidas = 0;
    }
    return this.http.post(base_url + '/cajas', caja).toPromise();
  }

  deleteCajas(id: string){
    return this.http.delete(base_url + '/cajas/' + id).toPromise();
  }

  actualizarCajas(id: string, caja){
    return this.http.put(base_url + '/cajas/' + id, caja).toPromise();
  }
}
