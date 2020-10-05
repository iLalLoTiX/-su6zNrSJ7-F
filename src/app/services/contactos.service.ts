import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  constructor(public http : HttpClient) { }

  getContactos(){
    return this.http.get(base_url + '/contactos');
  }

  getContacto(id: string){
    return this.http.get(base_url + '/contactos/' + id);
  }
  
  buscarContacto(nombre: string){
    return this.http.get(base_url + '/contactos/buscarContacto/' + nombre).toPromise();
  }

  buscarContactoEstricto(busqueda: string){
    return this.http.post(base_url + '/contactos/buscarContactoEstricto', {busqueda: busqueda}).toPromise();
  }

  postContacto(contacto){
    return this.http.post(base_url + '/contactos', contacto).toPromise();
  }

  deleteContacto(id: string){
    return this.http.delete(base_url + '/contactos/' + id).toPromise();
  }

  actualizarContacto(id: string, contacto){
    return this.http.put(base_url + '/contactos/' + id, contacto).toPromise();
  }
}
