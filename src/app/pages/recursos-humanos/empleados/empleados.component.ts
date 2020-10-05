import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'app/services/empleados.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styles: []
})
export class EmpleadosComponent implements OnInit {

  public empleados: any;
  public id: string;
  public i: number;

  constructor(private EmpleadosServices: EmpleadosService, public router: Router) { 
    EmpleadosServices.getEmpleados().subscribe((a:any) => this.empleados = a.empleados);
  }

  ngOnInit(): void {
  }

  agregarEmpleado(){
    this.router.navigate(['/empleados/empleado/nuevo']);
  }

  actualizarEmpleado(){
    this.router.navigate(['/empleados/empleado/' + this.id ]);
  }

  seleccionarEmpleado(id: string, i: number){
    this.id = id;
    this.i= i;
  }

  eliminarEmpleado(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Borrar este empleado no se podra deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.EmpleadosServices.deleteEmpleados(this.id).then(a=>{
          
          this.empleados.splice(this.i,1);
          return Swal.fire(
            'Exito',
            'El empleado ha sido borrado',
            'success'
          );
        }).catch(a=>console.log(a));
      }
    });

    
  }

}
