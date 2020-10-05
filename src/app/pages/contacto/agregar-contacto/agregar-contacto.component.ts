import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactosService } from 'app/services/contactos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.component.html',
  styles: []
})
export class AgregarContactoComponent implements OnInit {

  public formEntrada;

  constructor(
    private fb: FormBuilder,
    private ContactosServicios: ContactosService) {

      this.crearFormulario();
    }

  ngOnInit(): void {
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      nombre    :[, Validators.required],
      telefono  :[, Validators.required]
    });
  }

  crearProducto(){
    this.ContactosServicios.postContacto(this.formEntrada.value).then((a:any) => {

      Swal.fire(
        'Listo',
        'El contacto ha sido creado',
        'success'
      );
      return;
    }).catch( err => {
      console.log(err);
      return Swal.fire(
        'Atencíon',
        err.error.msg,
        'warning');
    });
  }

}
