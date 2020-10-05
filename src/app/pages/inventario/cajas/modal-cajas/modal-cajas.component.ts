import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CajasService } from 'app/services/cajas.service';
import Swal from 'sweetalert2'
import { Cajas } from 'app/models/cajas.interface';

@Component({
  selector: 'app-modal-cajas',
  templateUrl: './modal-cajas.component.html',
  styles: []
})
export class ModalCajasComponent implements OnInit {

  @Input() public closeModal;
  @Input() public caja: Cajas;

  public formEntrada;
  
  constructor(private fb: FormBuilder, private CajasServices: CajasService) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    if(this.caja !== undefined)
    {
      this.formEntrada.controls.nombre.value = this.caja.nombre;
      this.formEntrada.controls.peso.value = this.caja.peso;
      this.formEntrada.controls.precio.value = this.caja.precio;
      this.formEntrada.controls.inventario.value = this.caja.inventario;
      this.formEntrada.controls.rotas.value = this.caja.rotas;
      this.formEntrada.controls.perdidas.value = this.caja.perdidas;
    }    
  }

  salir(){
    this.closeModal.dismissAll();
  }

  crearFormulario()
  {
    this.formEntrada = this.fb.group({
      nombre      : [, Validators.required],
      peso        : [, Validators.required],
      precio      : [, Validators.required],
      inventario  : [],
      rotas       : [],
      perdidas    : [],
    });
  }
  agregarCaja(){
    if(!this.formEntrada.valid){
      return Swal.fire(
        'Atencíon',
        'Completa los campos',
        'warning'
      );
    }
    const cajaData = {
      nombre : this.formEntrada.controls.nombre.value,
      peso : this.formEntrada.controls.peso.value,
      precio : this.formEntrada.controls.precio.value,
      inventario : this.formEntrada.controls.inventario.value,
      rotas : this.formEntrada.controls.rotas.value,
      perdidas : this.formEntrada.controls.perdidas.value,
    };
    this.CajasServices.postCajas(cajaData).then((result) => {
      return Swal.fire(
        'Listo',
        'Caja creada',
        'success'
      );
    }).catch((err) => {
      return Swal.fire(
        'ERROR',
        'Ha habido un error ponte encontacto con el maestro del calabozo',
        'error'
      );
    });
    this.salir();
  }
}
