import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService } from 'app/services/ordenes.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ordenes-fecha',
  templateUrl: './ordenes-fecha.component.html',
  styles: []
})
export class OrdenesFechaComponent implements OnInit {

  public fechas: any= [];
  public productos: any = [];
  public tabla = new Array();
  public orden: string;
  public hoy;

  constructor(public servicioOrdenes : OrdenesService,
              private rutaActiva: ActivatedRoute,
              private router: Router) {
    
    this.hoy = moment().format('YYYY-MM-DD');

    this.servicioOrdenes.getOrdenes().subscribe((a: any) => {
      
      for(let i = 0; i < a.fechas.length; i++){
        this.fechas.push(a.fechas[i]);
      }

      for(let i = 0; i < a.orden.length; i++){
        a.orden[i].fechaDeEntrada = moment(a.orden[i].fechaDeEntrada).add(1, 'days').format('YYYY-MM-DD');
      }
      this.productos = a.productos;
      this.tabla = new Array (this.productos.length);

      
      for(let j = 0; j < this.tabla.length; j++){
        this.tabla[j] = new Array(this.fechas.length);
      }

      for(let z = 0; z < this.productos.length; z++)
      {
        for(let x = 0; x < this.fechas.length; x++)
        {
          try{
            this.tabla[z][x] = [];
          }catch(x){
          }
        }
      }

      

      for(let o = 0; o < a.orden.length; o++)
      {
        for(let i = 0; i < a.orden[o].productos.length; i++)
        {
          let b = this.fechas.indexOf( a.orden[o].fechaDeEntrada );
          let e = a.orden[o].productos[i].producto._id;
          let c = this.productos.findIndex(i => i.id === e);

          if(c != -1 && b != -1)
          {
            this.tabla[c][b].push({
              orden: a.orden[o], 
              producto: a.orden[o].productos[i]});
          }
        }
      }
    });
  }

  editarOrden(){
    this.router.navigate(['editarOrden/' + this.orden]);
  }

  eliminarOrden(){
    this.servicioOrdenes.deleteOrden(this.orden).subscribe(console.log);
    console.log(this.orden);
  }

  registrarOrden(){
    this.router.navigate(['crearEntradaProveedor/' + this.orden]);
  }

  seleccionarOrden(uid){
    this.orden = uid;
    console.log(uid);
  }

  ngOnInit(): void {
    
  }

}
