import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from 'app/services/ordenes.service';

@Component({
  selector: 'app-editar-orden',
  templateUrl: './editar-orden.component.html',
  styles: []
})
export class EditarOrdenComponent implements OnInit {

  public id;

  constructor(public servicioOrdenes : OrdenesService,
              private rutaActiva: ActivatedRoute) {
    
    this.id = this.rutaActiva.snapshot.params.id
    console.log(this.id);
    this.servicioOrdenes.getOrdene(this.id).subscribe(console.log);
   }

  ngOnInit(): void {
  }

}
