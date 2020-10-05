import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'app/services/productos.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './productos.component.html',
  styles: []
})
export class ProductosComponent implements OnInit {

  public productos;

  constructor(private ProductosServicios: ProductosService, public router: Router ) {
    this.ProductosServicios.getProductos().subscribe((a:any)=>{this.productos = a.productos});
  }

  agregarProducto(){
    this.router.navigate(['agregarProducto']);
  }

  actualizarProducto(id: string){
    this.router.navigate(['producto/' + id]);
  }

  ngOnInit(): void {
  }

  borrarProducto(id: string, i: number){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Borrar este producto no se podra deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ProductosServicios.deleteProducto(id).then(a=>{
          
          this.productos.splice(i,1);
          return Swal.fire(
            'Exito',
            'El producto ha sido borrado',
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
