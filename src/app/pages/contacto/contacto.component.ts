import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ContactosService } from 'app/services/contactos.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {

  public contactos;

  constructor(private ContactoServicios: ContactosService, public router: Router ) {
    this.ContactoServicios.getContactos().subscribe((a:any)=>{this.contactos = a.contacto});
  }

  agregarContacto(){
    this.router.navigate(['agregarContacto']);
  }

  actualizarContacto(id: string){
    this.router.navigate(['actualizarContacto/' + id]);
  }

  ngOnInit(): void {
  }

  borrarContacto(id: string, i: number){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Borrar este Contacto no se podra deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ContactoServicios.deleteContacto(id).then(a=>{
          
          this.contactos.splice(i,1);
          return Swal.fire(
            'Exito',
            'El contacto ha sido borrado',
            'success'
          );
        }).catch(a=>{
          return Swal.fire(
            'Error',
            'Hubo un error ponganse en contacto con el maestro del calabozo',
            'error'
          );
        });
      }
    });
  }
}
