import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-revisar-entrada-proveedor',
  templateUrl: './revisar-entrada-proveedor.component.html',
  styles: []
})
export class RevisarEntradaProveedorComponent implements OnInit {
  
  public formEntrada;
  public id;
  public entrada;

  constructor(
    public ServicioEntradasProveedor: EntradaProveedorService,
    private rutaActiva: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder){
      this.id = this.rutaActiva.snapshot.params.id;
      ServicioEntradasProveedor.getEntrada(this.id).subscribe((a:any) => { this.entrada = a.EntradaExiste; });
      this.crearFormulario();
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
