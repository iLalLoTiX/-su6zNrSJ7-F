import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DestinosMermaService {

  constructor(public http : HttpClient) { }

  buscarDestinos(nombre: string){
    return this.http.get(base_url + '/noIdoneo/buscarDestinos/' + nombre);
  }

  buscarDestinoEstricto(nombre: string){
    return this.http.get(base_url + '/noIdoneo/buscarDestino/' + nombre);
  }

  postDestino(destino){
    return this.http.post(base_url + '/noIdoneo', destino);
  }
}
