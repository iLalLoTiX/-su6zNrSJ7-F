import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EntradaCajasService {

  constructor(public http : HttpClient) { }

  getEntradasCajas(){
    return this.http.get(base_url + '/entradaCajas').toPromise();
  }

  filtrarFechas(busqueda: string){
    return this.http.get(base_url + '/empleados/busqueda/' + busqueda).toPromise();
  }

  postEntradaCajas(caja){
    return this.http.post(base_url + '/empleados', caja).toPromise();
  }

  actualizarEmpleados(id: string, caja){
    return this.http.put(base_url + '/empleados/' + id, caja).toPromise();
  }

  deleteEmpleados(id: string){
    return this.http.delete(base_url + '/empleados/' + id).toPromise();
  }
}
