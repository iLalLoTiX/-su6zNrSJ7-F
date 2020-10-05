import { Component, OnInit, Input, Output,EventEmitter }           from '@angular/core';
import { FormGroup, FormBuilder, FormArray }  from '@angular/forms';
import { Departamento }                       from '../../../../models/departamento.interface';
import { DepartamentosService }               from '../../../../services/departamentos.service';

@Component({
  selector: 'app-modal-departamentos',
  templateUrl: './modal-departamentos.component.html',
  styles: []
})
export class ModalDepartamentosComponent implements OnInit {

  @Output() devolverDepartamentoAgregar: EventEmitter<any>  = new EventEmitter();
  @Output() devolverDepartamentoActualizar: EventEmitter<any>  = new EventEmitter();

  @Input() public closeModal;
  @Input() public idDepartamento;
  @Input() public i;
  
  public modalDepartamento;
  public puestos = new Array();

  constructor(public departamentosServicio: DepartamentosService) {
    
  }

  ngOnInit(): void {
    if(this.idDepartamento !== undefined){
      this.departamentosServicio.getDepartamento(this.idDepartamento)
      .then((a:any) => {  
        this.modalDepartamento = a.departamento;
        return this.puestos = this.modalDepartamento.puestos;
      }).catch(a => {
        return console.log(a);
      });
    }
    
    this.modalDepartamento = new Departamento();

  }
  
  salir(){
    this.closeModal.dismissAll();
  }

  agregarPuesto(){
    this.puestos.push({
      nombre: ''
    });
  }

  crearDepartamento()
  {
    this.modalDepartamento.puestos = this.puestos;
    this.devolverDepartamentoAgregar.emit(this.modalDepartamento);
    this.salir();
  }

  actualizarDepartamento()
  {
    this.modalDepartamento.puestos = this.puestos;
    this.devolverDepartamentoActualizar.emit(this.modalDepartamento);
    this.salir();
  }

  eliminarPuesto(i: number)
  {
    this.puestos.splice(i, 1);
  }

  

}
