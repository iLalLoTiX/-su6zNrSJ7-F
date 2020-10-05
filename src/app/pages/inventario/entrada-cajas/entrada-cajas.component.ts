import { Component, OnInit } from '@angular/core';
import { EntradaCajasService } from 'app/services/entrada-cajas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entrada-cajas',
  templateUrl: './entrada-cajas.component.html',
  styles: []
})
export class EntradaCajasComponent implements OnInit {
  public entradaCajas;

  constructor(private EntradaCajasServicio: EntradaCajasService, private router: Router) { 
      this.EntradaCajasServicio.getEntradasCajas().then((res:any) => {
      this.entradaCajas = res.entradasCajas;
    }).catch((err) => {
      
    });
  }

  crearEntrada(){
    this.router.navigateByUrl('inventario/administrarEntradaCajas');
  }
  
  actualizarEntrada(){
    this.router.navigateByUrl('inventario/administrarEntradaCajas');
  }

  eliminarEntrada(){
    console.log('eliminarEntrada');
  }

  buscarEntradaPorEmpleado(){
    this.router.navigateByUrl('inventario/administrarEntradaCajas');
  }

  verMasEntradas(){
    console.log('verMasEntradas');
  }

  ngOnInit(): void {

  }

}
