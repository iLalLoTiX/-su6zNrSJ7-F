import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'app/services/empleados.service';
import { CajasService } from 'app/services/cajas.service';

@Component({
  selector: 'app-administrar-entrada-cajas',
  templateUrl: './administrar-entrada-cajas.component.html',
  styles: []
})
export class AdministrarEntradaCajasComponent implements OnInit {

  public choferes;
  public copilotos;
  public cajas;
  public cantidad;

  constructor(private EmpleadoServicio: EmpleadosService, private CajaServicio: CajasService) {

    this.EmpleadoServicio.buscarEmpleadoPuesto('chofer').then((a:any)=>{this.choferes = a.empleados; }).catch((a:any)=>console.log(a));
    this.EmpleadoServicio.buscarEmpleadoPuesto('copiloto').then((a:any)=>{this.copilotos = a.empleados; }).catch((a:any)=>console.log(a));
    this.CajaServicio.getCajas().subscribe((a:any)=> this.cajas = a.cajas );
    
  }

  ngOnInit(): void {
  }

  crearEntradaCajas(){
    console.log(this.cajas[1].caja);
  }

}
