import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlegraService {

  public headers;

  constructor(public http : HttpClient){
    this.headers = new HttpHeaders({'Authorization':'Basic bGFsb3RpeEBob3RtYWlsLmNvbTo3Mjc5YmZjOTg0ZWRmMGFjODVmMw=='})
  }

  getOrdenes(){
    return this.http.get('https://api.alegra.com/api/v1/purchase-orders',{ 
      headers: this.headers});
  }
  
  getOrdenId(id: number){
    return this.http.get('https://api.alegra.com/api/v1/purchase-orders/' + id,{ 
      headers: this.headers});
  }

  getProveedores(nombre: string, type: string = 'provider'){
    return this.http.get('https://api.alegra.com/api/v1/contacts/?type=' + type + '&name=' + nombre +'',{ 
      headers: this.headers});
  }

  getProveedor(idProveedor: number){
    return this.http.get('https://api.alegra.com/api/v1/contacts/' + idProveedor,{ 
      headers: this.headers}).pipe();
  }

  getProductoId(idProducto: number){
    return this.http.get('https://api.alegra.com/api/v1/items/?reference=' + idProducto,{ 
      headers: this.headers}).toPromise();
  }

  getProductoName(nameProducto: string){
    return this.http.get('https://api.alegra.com/api/v1/items/?name=' + nameProducto,{ 
      headers: this.headers});
  }

  postFacturaProveedor(raw){
    return this.http.post('https://api.alegra.com/api/v1/bills', raw , {headers : this.headers}).toPromise();
  }

  pagosAlanVersion1(){
    const Alan = {
      "date": "2020-08-25",
      "bankAccount": "6",
      "paymentMethod": "electronic-money",
      "observations": "Desde App Famarg",
      "anotation": "Desde App Famarg",
      "type": "in",
      "client": "112",
      "invoices": {},
      "categories": {}
    };

    
  }

  //obtenerBancos https://api.alegra.com/api/v1/bank-accounts/
  /**
    {
        "id": "6",
        "name": "Megasur Monedero",
        "number": "",
        "description": "Monedero Electronico",
        "type": "bank",
        "status": "active",
        "initialBalance": "22584.5700",
        "initialBalanceDate": "2020-07-01"
    },
    {
        "id": "7",
        "name": "Tanque Lleno",
        "number": "",
        "description": "Monedero Electronico",
        "type": "bank",
        "status": "active",
        "initialBalance": "27470.3300",
        "initialBalanceDate": "2020-07-01"
    },
   */
  //
  /**
   *  {
        "id": "21",
        "name": "Augusto Alexander Argüello Pacheco",
   */
}

  
