import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EntradaProveedorService {

  constructor(public http : HttpClient) { }

  getEntradasProveedor(){
    return this.http.get(base_url + '/entradaProveedor' ).toPromise();
  }

  porcentajeMermas(filtro){
    return this.http.get(base_url + '/entradaProveedor/porcentajeMermas', {params: filtro} ).toPromise();
  }

  getEntrada(id: string){
    return this.http.get(base_url + '/entradaProveedor/buscarEntrada/' + id);
  }

  postEntradaProveedor(entrada){
    return this.http.post(base_url + '/entradaProveedor', entrada);
  }

  deleteEntradaProveedor(id: string){
    return this.http.delete(base_url + '/entradaProveedor/borrarEntrada/' + id);
  }
  
  desmarcarEntradaProveedor(id: string){
    return this.http.delete(base_url + '/entradaProveedor/borrarDesmarcarEntrada/' + id);
  }

  actualizarEntradaProveedor(id: string, entrada){
    return this.http.put(base_url + '/entradaProveedor/editar/' + id, entrada);
  }

  mermarEntradaProveedor(dataEntrada: any, mermas){
    return this.http.put(base_url + '/entradaProveedor/mermar/' + dataEntrada.id, {mermas, index: dataEntrada.index});
  }
  
  filtrarEntradaProveedor(filtro, desde: number, limite: number){
    return this.http.get(base_url + '/entradaProveedor/filtrarFechas?desde=' + desde + '&limite=' + limite , {params: filtro}).toPromise();
  }

  estadisticaEntradaProveedor(filtro, desde: number, limite: number){
    return this.http.get(base_url + '/entradaProveedor/estadisticasEntradasProveedor', {params: filtro}).toPromise();
  }
}
