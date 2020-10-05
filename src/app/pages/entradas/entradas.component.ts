import { Component, OnInit } from '@angular/core';
import { AlegraService } from '../../services/alegra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {

  ordenes: any [];
  public closeResult = '';

  constructor( public AlegraS : AlegraService, private modalService: NgbModal, private router: Router) {
    AlegraS.getOrdenes().subscribe((a:any) => {
      this.ordenes = a;
      console.log(this.ordenes)});
   }

  ngOnInit(): void {
  }

  seleccionarOrden(id: number){
    this.router.navigateByUrl('/facturarCompra/' + id );
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

}
