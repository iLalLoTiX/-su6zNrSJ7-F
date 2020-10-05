import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'app/services/empleados.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos-humanos.component.html',
  styles: []
})
export class RecursosHumanosComponent implements OnInit {

  public empleados: any;
  public id: string;
  public i: number;
  public busqueda: string;

  constructor(private EmpleadosServices: EmpleadosService, public router: Router) { 
    EmpleadosServices.getEmpleados().subscribe((a:any) => this.empleados = a.empleados);
  }

  ngOnInit(): void {
  }

  agregarEmpleado(){
    this.router.navigate(['/empleados/empleado/nuevo']);
  }

  actualizarEmpleado(id: string){
    this.router.navigate(['/empleados/empleado/' + id ]);
  }

  seleccionarEmpleado(id: string, i: number){
    this.id = id;
    this.i= i;
    console.log(this.id, i);
  }

  eliminarEmpleado(id: string, i: number){
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
        this.EmpleadosServices.deleteEmpleados(id).then(a=>{
          
          this.empleados.splice(i,1);
          return Swal.fire(
            'Exito',
            'El empleado ha sido borrado',
            'success'
          );
        }).catch(a=>console.log(a));
      }
    });

    
  }

  verEmpleados(){
    this.router.navigate(['/empleados']);
  }

  buscarEmpleados(){
    this.EmpleadosServices.buscarEmpleados(this.busqueda).then((a:any)=>{console.log(a); this.empleados = a.empleados}).catch(a => console.log(a));
  }
}
