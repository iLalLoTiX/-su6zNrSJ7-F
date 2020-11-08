import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService } from 'app/services/ordenes.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ordenes-tabla',
  templateUrl: './ordenes-tabla.component.html',
  styles: []
})
export class OrdenesTablaComponent implements OnInit {
  
  public tabla = new Array();
  public hoy;

  constructor(public servicioOrdenes : OrdenesService,
              private rutaActiva: ActivatedRoute,
              private router: Router) {
    
    this.hoy = moment().format('YYYY-MM-DD');

    this.servicioOrdenes.getOrdenes().subscribe((a: any) => {
      
      this.tabla = a.orden;
    
    });
  }

  momento(fecha){
    let a = moment(fecha).format('YYYY-MM-DD');
    return a;
  }

  editarOrden(id){
    
    this.router.navigate(['editarOrden/' + id]);
  }

  eliminarOrden(id){
    this.servicioOrdenes.deleteOrden(id).subscribe(console.log);
    console.log(id);
  }

  registrarOrden(id){
    
    this.router.navigate(['crearEntradaProveedor/' + id]);
  }

  ngOnInit(): void {
    
  }

}
