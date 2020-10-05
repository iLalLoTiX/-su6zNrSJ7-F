import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { EmpleadosService } from 'app/services/empleados.service';
import { DepartamentosService } from 'app/services/departamentos.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { FileUploadService } from 'app/services/file-upload.service';

const base_url = environment.base_url;

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styles: []
})
export class EmpleadoComponent implements OnInit {

  public evento: string;
  public formEntrada;
  public departamentos;
  public puestos;
  public banderaID;
  public banderaPuesto = false;
  public imgURL = 'http://localhost:3000/api/cargar/usuarios/no-image.jpg';
  public imagen: File;
  public imgTemp;

  constructor(
    private rutaActiva: ActivatedRoute, 
    private fb: FormBuilder, 
    private empleadosServices: EmpleadosService, 
    private DepartamentoServicio: DepartamentosService, 
    private FileUploadServices: FileUploadService,
    public router: Router) {

    this.DepartamentoServicio.getDepartamentos().subscribe((a:any)=>  {this.departamentos = a.departamentos;});
    this.crearFormulario();
    this.escucharDepartamento();
    this.banderaID = this.rutaActiva.snapshot.params.id;
    if(this.banderaID !== 'nuevo'){
      this.banderaPuesto = true;
      this.empleadosServices.getEmpleado(this.rutaActiva.snapshot.params.id).then((a:any) => {
        this.formEntrada.patchValue({
          idInterno: a.empleado.idInterno,
          correo: a.empleado.correo,
          telefono: a.empleado.telefono,
          nombre: a.empleado.nombre,
          puesto: a.empleado.puesto,
          sexo: a.empleado.sexo,
          img: a.empleado.img,
          direccion: a.empleado.direccion,
          ciudad: a.empleado.ciudad,
          departamento: a.empleado.departamento._id,
          emergencia: a.empleado.emergencia,
          sangre: a.empleado.sangre,
        });
        this.imgURL = base_url + '/cargar/empleados/' + a.empleado.img;
      }).catch(a=>console.log(a));
    }
  }

  ngOnInit(): void {
  }

  cambiarImagen(file){
    this.imagen = file;

    if(!file){return this.imgTemp = null ;}

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp= reader.result;
    }
  }

  subirImagen(id?: string){
    if(this.banderaID === 'nuevo'){
      this.banderaID = id;
      return this.FileUploadServices.actualizarFoto(this.imagen, 'empleados', this.banderaID).then(img => console.log(img)).catch(a => console.log(a));
    }
    this.FileUploadServices.actualizarFoto(this.imagen, 'empleados', this.banderaID).then(img => console.log(img)).catch(a => console.log(a));
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      idInterno     : [, Validators.required],
      correo        : [, Validators.required],
      telefono      : [, Validators.required],
      nombre        : [, Validators.required],
      puesto        : [, Validators.required],
      sexo          : [, Validators.required],
      img           : [],
      direccion     : [],
      ciudad        : [],
      departamento  : [],
      emergencia    : [],
      sangre        : [],
    });
  }

  escucharDepartamento(){
    this.formEntrada.get('departamento').valueChanges.subscribe( puesto => {
      this.DepartamentoServicio.getDepartamento(puesto).then((a:any) => {
        this.puestos = a.departamento.puestos;
        if(this.banderaPuesto === true){
          return this.banderaPuesto = false;
        }
        
        this.formEntrada.patchValue({
          puesto: this.puestos[0].nombre
        })
      })
    });
  }

  crearEmpleado(){
      
      this.empleadosServices.postEmpleados(this.formEntrada.value).then((a:any) => {

        Swal.fire(
          'Listo',
          'El empleado ha sido agregado',
          'success'
        );
        if(this.imagen !== undefined){
          this.subirImagen(a.empleado.uid);
        }
        this.volverEmpleados();
        return;
      }).catch( err => {
        return Swal.fire(
          'Atencíon',
          err.error.msg,
          'warning');
      });
  }

  actualizarEmpleado(){
      
    this.empleadosServices.actualizarEmpleados(this.banderaID, this.formEntrada.value).then((a:any) => {
      
      Swal.fire(
        'Listo',
        'El empleado ha sido actualizado',
        'success'
      );
      if(this.imagen !== undefined){
        this.subirImagen();
      }
      this.volverEmpleados();
      return;
    }).catch( err => {
      return Swal.fire(
        'Atencíon',
        err.error.msg,
        'warning');
    });
}

  volverEmpleados(){
    this.router.navigate(['/empleados']);
  }
}
