import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(public http : HttpClient) { 
    
  }

  getOrdenes(){
    return this.http.get(base_url + '/ordenes' );
  }

  getOrden(id){
    return this.http.get(base_url + '/ordenes/' + id );
  }

  postOrden(orden){
    return this.http.post(base_url + '/ordenes', orden );
  }

  editarOrden(id, orden){
    return this.http.put(base_url + '/ordenes/editar/' + id, orden );
  }

  deleteOrden(id){
    return this.http.delete(base_url + '/ordenes/' + id );
  }

  registrarOrden(id){
    return this.http.put(base_url + '/ordenes/registrar/' + id, 'aprobado');
  }

  desmarcarOrden(id){
    return this.http.put(base_url + '/ordenes/desmarcar/' + id, 'aprobado');
  }

}
