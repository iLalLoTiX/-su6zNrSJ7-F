import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductosService } from 'app/services/productos.service';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styles: []
})
export class AddProductoComponent implements OnInit {

  public formEntrada;

  constructor(
    private fb: FormBuilder,
    private ProductoServicio: ProductosService) {

      this.crearFormulario();
    }

  ngOnInit(): void {
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      sku       :[, Validators.required],
      nombre    :[, Validators.required],
      categoria :[, Validators.required]
    });
  }

  crearProducto(){
    this.ProductoServicio.postProductos(this.formEntrada.value).then((a:any) => {

      Swal.fire(
        'Listo',
        'El producto ha sido creado',
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
