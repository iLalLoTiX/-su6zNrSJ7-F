import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(public http : HttpClient) { }

  getProductos(){
    return this.http.get(base_url + '/productos');
  }

  getProducto(id: string){
    return this.http.get(base_url + '/productos/' + id);
  }

  buscarProducto(nombre: string){
    return this.http.get(base_url + '/productos/buscarProducto/' + nombre).toPromise();
  }

  postProductos(producto){
    return this.http.post(base_url + '/productos', producto).toPromise();
  }

  deleteProducto(id: string){
    return this.http.delete(base_url + '/productos/' + id).toPromise();
  }

  actualizarProductos(id: string, producto){
    return this.http.put(base_url + '/productos/' + id, producto).toPromise();
  }

  buscarProductoEstricto(busqueda: string){
    return this.http.post(base_url + '/productos/buscarProductoEstricto', {busqueda: busqueda}).toPromise();
  }
}
