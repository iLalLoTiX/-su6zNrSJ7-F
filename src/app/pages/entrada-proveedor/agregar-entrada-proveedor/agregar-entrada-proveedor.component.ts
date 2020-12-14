import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ContactosService } from 'app/services/contactos.service';
import { ProductosService } from 'app/services/productos.service';
import * as moment from 'moment';
import { OrdenesService } from 'app/services/ordenes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-agregar-entrada-proveedor',
  templateUrl: './agregar-entrada-proveedor.component.html',
  styles: []
})
export class AgregarEntradaProveedorComponent implements OnInit {

  public orden = {
    ordenCompra: '',
    proveedor: '',
    productos: new Array(),
    fecha: moment().format('YYYY-MM-DD')
  };

  public productoKilos: number;
  public index: number;

  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public proveedores;
  public productos;
  public idOrden;
  public ordenExiste: boolean = false;

  constructor(
    private ServicioOrden: OrdenesService,
    public ServicioEntradasProveedor: EntradaProveedorService,
    private ServicioProveedor: ContactosService,
    private ServicioProducto: ProductosService,
    private router: Router, 
    private rutaActiva: ActivatedRoute) {
    
      console.log(this.productoKilos);
      if(this.rutaActiva.snapshot.params.id != 'nuevaEntrada'){
        this.ServicioOrden.getOrden(this.rutaActiva.snapshot.params.id).subscribe((a:any) => {
          this.idOrden = this.rutaActiva.snapshot.params.id;
          this.ordenExiste = true;
          this.orden.ordenCompra = a.orden.ordenCompra;
          this.orden.proveedor = a.orden.proveedor.nombre;
          
          for(let i = 0; i < a.orden.productos.length; i++){
            this.orden.productos.push({nombre: a.orden.productos[i].producto.nombre, kg: a.orden.productos[i].cantidad});
          }

        },
        err => console.log(err)
        );
      }else{
        console.log(this.idOrden);
      }
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
    let enviar = {
      proveedor: '',
      productos: new Array(),
      fechaDeEntrada: '',
      ordenCompra: ''
    };

    if(this.orden.proveedor == ''){
      return Swal.fire(
        'Atención',
        'Seleccione un proveedor',
        'warning'
      );
    }

    //Si se ingreso un proveedor, se comprueba si dicho proveedor existe en la base de datos
    await this.ServicioProveedor.buscarContactoEstricto(this.orden.proveedor).then(
      (res:any) => {
        enviar.proveedor = res.contacto.uid;
    }).catch(
      (err: any) => {
        //si no se encontro al proveedor en la base de datos se termina el proceso
        return Swal.fire(
          'Atención',
          err.error.msg,
          'warning'
        );}
    );

    //se pregunta si hay productos en la orden de compra
    if(this.orden.productos.length <= 0){
      //Si no hay se cancela la operación y envia un mensaje
      return Swal.fire(
        'Atención',
        'Agregue productos a la orden de compra!',
        'warning'
      );
    }

    let i = this.orden.productos.length;
    if(this.orden.productos[i - 1].nombre == ''){
      return Swal.fire(
        'Atencíon',
        'Selecciona un producto en la fila ' + i,
        'warning');
    }

    if(this.orden.productos[this.orden.productos.length - 1].kg <= 0){
      return Swal.fire(
        'Atencíon',
        'Agregue una cantidad en la fila ' + i,
        'warning');
    }

    if(this.orden.productos[this.orden.productos.length - 1].precio <= 0){
      return Swal.fire(
        'Atencíon',
        'Agregue un precio en la fila ' + i,
        'warning');
    }

    for(let o = 0; o < i; o++)
    {
      //Si hay asignada una cantidad y un producto, se verifica la existencia del producto  
      await this.ServicioProducto.buscarProductoEstricto(this.orden.productos[o].nombre).then(
        (res:any) => {
          //Si el producto existe, se agrega al array, para preparase para su envio a la peticion a la base de datos
          enviar.productos.push({producto: res.producto.uid, cantidad: this.orden.productos[o].kg, precio: this.orden.productos[o].precio});
      }).catch(
        (err: any) => { 
          return this.devolverError(err.error.msg);
      });
    }

    enviar.fechaDeEntrada = this.orden.fecha;
    enviar.ordenCompra = this.orden.ordenCompra;
    
    await this.ServicioEntradasProveedor.postEntradaProveedor(enviar).subscribe(
    data => {
      console.log(data);
      Swal.fire(
        'Exito',
        'Entrada creada correctamente',
        'success');
      },
      err => {
        console.log(err)
      });

    if(this.ordenExiste){
      await this.ServicioOrden.registrarOrden(this.idOrden).subscribe();
      await this.ServicioOrden.editarOrden(this.idOrden, enviar).subscribe();
      return this.router.navigate(['almacen']); 
    }
  }

  calcular(kilos, i){
    this.productoKilos = kilos;
    this.index = i;
  }

  cancelar(){
    this.productoKilos = undefined;
  }

  afirmar(data){
    this.productoKilos = undefined;
    this.orden.productos[data.index].kg = data.destarado;
    this.orden.productos[data.index].precio = data.precio;
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
        proveedor.nombre = this.orden.proveedor;
        console.log(proveedor);
        this.ServicioProveedor.postContacto(proveedor).then(a=>{
          return Swal.fire(
            'Exito',
            'Se ha creado el proveedor',
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

  errorProducto(nombre, i){
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
        this.agregarProducto(nombre, i);
      }
      else{
        this.orden.productos.splice(i, 1);
      }
    });
  }

  agregarProducto(nombre, i){
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
        producto.nombre = nombre;
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

  anadirFila(){
    let i = this.orden.productos.length;
    if(i == 0){
      this.orden.productos.push({nombre: '', kg: 0, precio: 0});
    }
    else{
      if(this.orden.productos[i - 1].nombre == ''){
        return Swal.fire(
          'Atencíon',
          'Selecciona un producto en la fila ' + i,
          'warning');
      }

      if(this.orden.productos[this.orden.productos.length - 1].kg <= 0){
        return Swal.fire(
          'Atencíon',
          'Agregue una cantidad en la fila ' + i,
          'warning');
      }

      if(this.orden.productos[this.orden.productos.length - 1].precio <= 0){
        return Swal.fire(
          'Atencíon',
          'Agregue un precio en la fila ' + i,
          'warning');
      }
      
      this.orden.productos.push({nombre: '', kg: 0, precio: 0});
    }
    
    console.log(this.orden.productos.length);
    console.log(this.orden.productos[this.orden.productos.length - 1].nombre);
  }

  eliminarProducto(i){
    Swal.fire({
    text: 'Quieres borrar este producto de la orden?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrarlo',
    cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.orden.productos.splice(i, 1);
      }
    });
  }

  async comprobarProducto(nombre: string, i: number){

    if( nombre == ''){
      this.orden.productos.splice(i, 1);
      return;
    }
    
    //Validacion Producto
    await this.ServicioProducto.buscarProductoEstricto(nombre).then(
      (res:any) => {
        this.orden.productos[i].id = res.producto.uid;
    }).catch(
      (err: any) => {  
        return this.errorProducto(nombre, i);
    });
  }

  async comprobarProveedor(proveedor){
    if( proveedor == ''){
      return;
    }
    await this.ServicioProveedor.buscarContactoEstricto(proveedor).then(
      (res:any) => {
        
    }).catch(
      (err: any) => {  
        return this.errorProveedor();
    });
  }

  devolverError(error){
    Swal.fire(
      'Atencíon',
      error,
      'warning');
  }

}
