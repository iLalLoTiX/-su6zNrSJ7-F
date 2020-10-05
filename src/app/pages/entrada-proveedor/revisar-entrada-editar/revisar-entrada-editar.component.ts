import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-revisar-entrada-editar',
  templateUrl: './revisar-entrada-editar.component.html',
  styles: []
})
export class RevisarEntradaEditarComponent implements OnInit {
  public formEntrada;
  public id;
  public entrada;

  constructor(
    public ServicioEntradasProveedor: EntradaProveedorService,
    private rutaActiva: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder){
      this.crearFormulario();
      this.id = this.rutaActiva.snapshot.params.id;
      ServicioEntradasProveedor.getEntrada(this.id).subscribe((a:any) => { 
        this.entrada = a.EntradaExiste; 
        this.formEntrada.patchValue({
          bueno    : this.entrada.bueno,
          malo  : this.entrada.malo
        })
      });
      this.escucharMalo();
    }

  ngOnInit(): void {
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      bueno :[{value: '', disabled: true}, Validators.required],
      malo  :[, Validators.required],
    });
  }

  escucharMalo(){
    this.formEntrada.get('malo').valueChanges.subscribe( malo => {
      if((this.entrada.kg - malo) >= 0){
        this.formEntrada.patchValue({
          bueno: this.entrada.kg - malo
        });
      }else{
        Swal.fire(
          'Atención',
          'No se puede ingresar un valor mayor al producto entrante',
          'warning');
      }
    });
  }

  desmarcar(){

    let enviar = {
      bueno: 0,
      malo: 0,
      revisado: false 
    }

    Swal.fire({
      title: '¿Quieres desmarcar este registro como revisado?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Desmarcar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ServicioEntradasProveedor.desmarcarEntradaProveedor(this.id, enviar).subscribe(
          (a: any) => 
          {
            Swal.fire(
            'Listo',
            'Se desmarco la entrada como revisado',
            'success');
            this.router.navigate(['entradaProveedor']);
            return;
          },
          (err: any) => 
          {
            console.log(err);
          }
        );
      }
    });
  }

  revisarEntrada(){
    if((this.entrada.kg - this.formEntrada.value.malo) <= 0){
      Swal.fire(
        'Atención',
        'No se puede ingresar un valor mayor al producto entrante',
        'warning');
      return;
    }
    this.ServicioEntradasProveedor.revisarEntradaProveedor(this.id, this.formEntrada.value).subscribe(
      (a: any) => 
      {
        Swal.fire(
        'Listo',
        'Se agrego una entrada de producto',
        'success');
        this.router.navigate(['entradaProveedor']);
        return;
      },
      (err: any) => 
      {
        return Swal.fire(
          'Atencíon',
          err.error.msg,
          'warning');
      }
    );
  }
}
