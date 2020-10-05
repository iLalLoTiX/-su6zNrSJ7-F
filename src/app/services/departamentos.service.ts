import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  constructor(public http : HttpClient) { }

  getDepartamentos(){
    return this.http.get(base_url + '/departamentos');
  }

  getDepartamento(id: string){
    if(id == 'Ventas'){
      return
    }
    return this.http.get(base_url + '/departamentos/' + id).toPromise();
  }

  crearDepartamentos(departamento){
    return this.http.post(base_url + '/departamentos',departamento).toPromise();
  }

  deleteDepartamentos(id: string){
    return this.http.delete(base_url + '/departamentos/' + id).toPromise();
  }

  actualizarDepartamentos(id: string, deparamento){
    return this.http.put(base_url + '/departamentos/' + id, deparamento).toPromise();
  }

}
