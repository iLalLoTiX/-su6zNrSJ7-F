import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  

  constructor(public http : HttpClient) { }

  getTotalEmpleados(){
    return this.http.get(base_url + '/empleados/total').toPromise();
  }

  buscarEmpleados(busqueda: string){
    return this.http.get(base_url + '/empleados/busqueda/' + busqueda).toPromise();
  }

  buscarEmpleadoPuesto(busqueda: string){
    return this.http.get(base_url + '/empleados/puesto/' + busqueda).toPromise();
  }

  getEmpleados(){
    return this.http.get(base_url + '/empleados');
  }

  getEmpleado(id: string){
    return this.http.get(base_url + '/empleados/empleado/' + id).toPromise();
  }

  postEmpleados(caja){
    if(caja.inventario === null){
      caja.inventario = 0;
    }
    if(caja.rotas === null){
      caja.rotas = 0;
    }
    if(caja.perdidas === null){
      caja.perdidas = 0;
    }
    return this.http.post(base_url + '/empleados', caja).toPromise();
  }

  deleteEmpleados(id: string){
    return this.http.delete(base_url + '/empleados/' + id).toPromise();
  }

  actualizarEmpleados(id: string, caja){
    return this.http.put(base_url + '/empleados/' + id, caja).toPromise();
  }
}
