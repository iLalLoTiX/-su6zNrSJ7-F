import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CajasService } from '../../../services/cajas.service';
import { Cajas } from 'app/models/cajas.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styles: []
})
export class CajasComponent implements OnInit {

  public cajas;
  public caja;

  constructor(private CajasServices : CajasService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.obtenerCajas();
  }

  obtenerCajas(){
    this.CajasServices.getCajas().subscribe((a: any) => {this.cajas = a.cajas;console.log(this.cajas);});
  }

  
  seleccionarCaja(caja: Cajas){
    console.log(caja);
    this.caja = caja;
  }

  agregarCaja(content) {
    this.caja = undefined;
    this.modalService.open(content, { size: 'lg' });
  }
  
  borrarCaja(){
    if(this.caja === undefined){
      return Swal.fire(
        'Atencíon',
        'Selecciona una caja',
        'warning'
      );
    }
    
    console.log(this.caja.uid);
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Al borrar esta caja no se podra deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        this.CajasServices.deleteCajas(this.caja.uid).then(a => console.log(a)).catch(a => {
          return Swal.fire(
            'ERROR',
            'Ha habido un error ponte encontacto con el maestro del calabozo',
            'error'
          );
        });

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  }

  actualizarCaja(content){
    if(this.caja === undefined){
      return Swal.fire(
        'Atencíon',
        'Selecciona una caja',
        'info'
      );
    }
    this.modalService.open(content, { size: 'lg' });
  }

}
