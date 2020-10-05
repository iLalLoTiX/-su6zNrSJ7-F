import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';

@Component({
  selector: 'app-actualizar-entrada-proveedor',
  templateUrl: './actualizar-entrada-proveedor.component.html',
  styles: []
})
export class ActualizarEntradaProveedorComponent implements OnInit {

  
  public formEntrada;
  public entradaProveedor;
  public id;

  constructor(
    public ServicioEntradasProveedor: EntradaProveedorService,
    private rutaActiva: ActivatedRoute,
    private fb: FormBuilder) {

      this.crearFormulario();
      this.id = this.rutaActiva.snapshot.params.id

  }

  ngOnInit(): void {
    this.ServicioEntradasProveedor.getEntrada(this.id).subscribe((a:any)=>{ this.entradaProveedor = a.EntradaExiste
      this.formEntrada.patchValue({
        proveedor : this.entradaProveedor.proveedor,
        producto  : this.entradaProveedor.producto,
        kg        : this.entradaProveedor.kg,
      })
    });
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      proveedor :[, Validators.required],
      producto  :[, Validators.required],
      kg        :[, Validators.required]
    });
  }

  actualizarEntrada(){
    this.ServicioEntradasProveedor.actualizarEntradaProveedor(this.id, this.formEntrada.value).then((a:any) => {
      Swal.fire(
        'Listo',
        'Se agrego una entrada de producto',
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
