import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from 'app/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: []
})
export class ProductoComponent implements OnInit {

  public formEntrada;
  public producto;
  public id;
  constructor(
    private fb: FormBuilder,
    private rutaActiva: ActivatedRoute,
    private ProductoServicio: ProductosService) { 
      this.crearFormulario();
      this.id = this.rutaActiva.snapshot.params.id
    }

  ngOnInit(): void {
    this.ProductoServicio.getProducto(this.id).subscribe((a:any)=>{ this.producto = a.producto;
      this.formEntrada.patchValue({
        sku       : this.producto.sku,
        nombre    : this.producto.nombre,
        categoria : this.producto.categoria
      })
    });
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      sku       :[, Validators.required],
      nombre    :[, Validators.required],
      categoria :[, Validators.required]
    });
  }

  actualizarProducto(){
    this.ProductoServicio.actualizarProductos(this.id, this.formEntrada.value).then((a:any) => {

      Swal.fire(
        'Listo',
        'El producto ha sido actualizado',
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
