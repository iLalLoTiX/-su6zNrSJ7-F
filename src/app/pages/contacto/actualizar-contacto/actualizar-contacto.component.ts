import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactosService } from 'app/services/contactos.service';

@Component({
  selector: 'app-actualizar-contacto',
  templateUrl: './actualizar-contacto.component.html',
  styles: []
})
export class ActualizarContactoComponent implements OnInit {

  public formEntrada;
  public contacto;
  public id;
  constructor(
    private fb: FormBuilder,
    private rutaActiva: ActivatedRoute,
    private ContactoServicio: ContactosService) { 
      this.crearFormulario();
      this.id = this.rutaActiva.snapshot.params.id
    }

  ngOnInit(): void {
    this.ContactoServicio.getContacto(this.id).subscribe((a:any)=>{ this.contacto = a.contacto
      this.formEntrada.patchValue({
        nombre    : this.contacto.nombre,
        telefono  : this.contacto.telefono
      })
    });
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      nombre    :[, Validators.required],
      telefono  :[, Validators.required]
    });
  }

  actualizarContacto(){
    this.ContactoServicio.actualizarContacto(this.id, this.formEntrada.value).then((a:any) => {

      Swal.fire(
        'Listo',
        'El contacto ha sido actualizado',
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
