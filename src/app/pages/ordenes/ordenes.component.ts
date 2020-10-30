import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService } from 'app/services/ordenes.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styles: []
})
export class OrdenesComponent{

  public banderaVista: boolean = true;

  constructor(public servicioOrdenes : OrdenesService,
              private rutaActiva: ActivatedRoute,
              private router: Router) {
    
      
  }

  cambiarVista(bandera){
    this.banderaVista = bandera;
  }
  
  crearOrden(){
    this.router.navigate(['crearOrden']);
  }
}
