import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ContactosService } from 'app/services/contactos.service';
import { ProductosService } from 'app/services/productos.service';

@Component({
  selector: 'app-agregar-entrada-proveedor',
  templateUrl: './agregar-entrada-proveedor.component.html',
  styles: []
})
export class AgregarEntradaProveedorComponent implements OnInit {

  public dataEntrada = {
    proveedor: '',
    producto: '',
    kg: 0,
  };

  public enviar = {
    proveedor: '',
    producto: '',
    kg: 0,
  };

  public pasa = true;

  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public proveedores;
  public productos;

  constructor(
    public ServicioEntradasProveedor: EntradaProveedorService,
    private fb: FormBuilder,
    private ServicioProveedor: ContactosService,
    private ServicioProducto: ProductosService) {

  }

  ngOnInit(): void {
  }

  buscarProveedorInput($event){
    clearTimeout(this.typingTimer);
    if ($event.target.value) {
      this.typingTimer = setTimeout(() => {
        this.ServicioProveedor.buscarContacto($event.target.value).then((a: any) => {
          this.proveedores = a.contactos;
        }).catch((err) => {

        });
      } ,this.doneTypingInterval);
    }
  }

  buscarProductoInput($event){
    clearTimeout(this.typingTimer);
    if ($event.target.value) {
      this.typingTimer = setTimeout(() => {
        this.ServicioProducto.buscarProducto($event.target.value).then((a: any) => {
          this.productos = a.productos;
        }).catch((err) => {

        });
      } ,this.doneTypingInterval);
    }
  }

  async crearEntrada()
  {
    if(this.dataEntrada.proveedor == '' || this.dataEntrada.producto == '' || this.dataEntrada.kg <= 0){
      return Swal.fire(
        'Atención',
        'Llene todos los campos',
        'warning'
      );
    }
    this.pasa = true;
    //Validacion proveedor
    await this.ServicioProveedor.buscarContactoEstricto(this.dataEntrada.proveedor).then(
      (res:any) => {
        this.enviar.proveedor = res.contacto.uid;
    }).catch(
      (err: any) => {  
        this.pasa = false;
        return this.errorProveedor();
    });

    if(!this.pasa){
      return;
    }
    //Validacion Producto
    await this.ServicioProducto.buscarProductoEstricto(this.dataEntrada.producto).then(
      (res:any) => {
        this.enviar.producto = res.producto.uid;
    }).catch(
      (err: any) => {  
        this.pasa = false;
        return this.errorProducto();
    });
    
    if(!this.pasa){
      return;
    }

    this.enviar.kg = this.dataEntrada.kg;

    await this.ServicioEntradasProveedor.postEntradaProveedor(this.enviar).then((a:any) => {

      Swal.fire(
        'Listo',
        'Se agrego una entrada de producto',
        'success'
      );
      return;
    }).catch( err => {
      return Swal.fire(
        'Error',
        'Hubo un error ponganse en contacto con el maestro del calabozo',
        'error'
      );
    });
  }

  errorProveedor(){
    Swal.fire({
      title: 'Atencion',
      text: "El proveedor solicitado no existe ¿Quieres crearlo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Crearlo',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        const proveedor = {nombre: ''}; 
        proveedor.nombre = this.dataEntrada.proveedor;
        console.log(proveedor);
        this.ServicioProveedor.postContacto(proveedor).then(a=>{
          return Swal.fire(
            'Exito',
            'Se ha creado el producto, agregue de nuevo la entrada',
            'success'
          );
        }).catch(a=>{
          console.log(a);
          return Swal.fire(
            'Error',
            'Hubo un error ponganse en contacto con el maestro del calabozo',
            'error'
          );
        });
      }
    });
  }

  errorProducto(){
    Swal.fire({
      title: 'Atencion',
      text: "El producto solicitado no existe ¿Quieres crearlo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Crearlo',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.agregarProducto();
      }
    });
  }

  agregarProducto(){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1'],
    }).queue([
      {
        title: 'Introduce el SKU'
      },
    ]).then((result: any) => {
      if (result.value) {
        const answers = result.value;
        const producto = {nombre: '', sku: ''}; 
        producto.nombre = this.dataEntrada.producto;
        producto.sku = answers[0];
        console.log(producto);
        this.ServicioProducto.postProductos(producto).then(a=>{
          return Swal.fire(
            'Exito',
            'Se ha creado el producto, agregue de nuevo la entrada',
            'success'
          );
        }).catch(a=>{
          console.log(a.error.msg);
          return Swal.fire(
            'Error',
            a.error.msg,
            'error'
          );
        });
      }
    })
  }
}
