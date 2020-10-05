import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from 'app/services/departamentos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styles: []
})
export class DepartamentosComponent implements OnInit {

  public departamentos: any;
  public idDepartamento;
  public i;

  constructor(public departamentosServicio: DepartamentosService, private modalService: NgbModal) {
    departamentosServicio.getDepartamentos().subscribe((a:any) => this.departamentos = a.departamentos);
  }

  ngOnInit(): void {
  }
  
  modalDepartamento(content){
    this.idDepartamento = undefined;
    this.modalService.open(content);
  }

  agregarDepartamento(departamento){
    this.departamentosServicio.crearDepartamentos(departamento).then((a:any) => 
    {
      console.log(a.departamento);
      this.departamentos.push(a.departamento);
    }).catch(a => {
      console.log(a)
    })
  }

  actualizarDepartamento(departamento){
    this.departamentosServicio.actualizarDepartamentos(departamento.uid, departamento).then((a:any) => 
    {
      this.departamentos.splice(this.i, 1, a.departamento);
    }).catch(a => {
      console.log(a)
    });
  }

  editarDepartamento(content, id: string, i: number){
    this.idDepartamento = id;
    this.i = i;
    this.modalService.open(content);
  }


  borrarDepartamento(id: string, i: number){
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

        this.departamentosServicio.deleteDepartamentos(id)
        .then(a => {
          console.log(a);
          this.departamentos.splice(i,1);
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        }).catch(a => {return Swal.fire(
          'ERROR',
          'Ha habido un error ponte encontacto con el maestro del calabozo',
          'error'
        );
        });
      }
    });
    
  }

}

  /*
  Socios
    -Socio
  Recursos Humanos
    -Gerente de RH
    -Administrador
  Bodega de empaque
    -Gestor de calidad
    -Recepcion de productos
    -Director de pesaje
    -Empacador
  Sistemas
    -Programador
  Contabilidad
    -Gestor de pagos
  Facturación
    -Facturador
  Cobranza
    -Gestor de cobros
  Ventas
    -Asistente de ventas
  Compras
    -Comprador
  Trafico
    -Chofer
    -Copiloto
    -Recolector de cajas
  Promotoria
    -promotor
  */
