import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ContactosService } from 'app/services/contactos.service';
import { ProductosService } from 'app/services/productos.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-entrada-proveedor',
  templateUrl: './actualizar-entrada-proveedor.component.html',
  styles: []
})
export class ActualizarEntradaProveedorComponent implements OnInit {

  public entrada = {
    ordenCompra: '',
    proveedor: '',
    productos: new Array(),
    fecha: moment().format('YYYY-MM-DD')
  };

  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public proveedores;
  public productos;
  public idEntrada;

  constructor(
    public ServicioEntradasProveedor: EntradaProveedorService,
    private ServicioProveedor: ContactosService,
    private ServicioProducto: ProductosService,
    private router: Router, 
    private rutaActiva: ActivatedRoute) {
    
        this.ServicioEntradasProveedor.getEntrada(this.rutaActiva.snapshot.params.id).subscribe((a:any) => {
          console.log(a);
          this.idEntrada = this.rutaActiva.snapshot.params.id;
          this.entrada.proveedor = a.EntradaExiste.proveedor.nombre;
          this.entrada.fecha = moment(a.EntradaExiste.fechaDeEntrada).format('YYYY-MM-DD');
          this.entrada.ordenCompra = a.EntradaExiste.ordenCompra;
          
          for(let i = 0; i < a.EntradaExiste.productos.length; i++){
            this.entrada.productos.push({nombre: a.EntradaExiste.productos[i].producto.nombre, kg: a.EntradaExiste.productos[i].cantidad})
          }
        },
        err => console.log(err)
        );
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

  async actualizarEntrada()
  {
    let enviar = {
      proveedor: '',
      productos: new Array(),
      fechaDeEntrada: '',
      ordenCompra: ''
    };

    if(this.entrada.proveedor == ''){
      return Swal.fire(
        'Atención',
        'Seleccione un proveedor',
        'warning'
      );
    }

    //Si se ingreso un proveedor, se comprueba si dicho proveedor existe en la base de datos
    await this.ServicioProveedor.buscarContactoEstricto(this.entrada.proveedor).then(
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
    if(this.entrada.productos.length <= 0){
      //Si no hay se cancela la operación y envia un mensaje
      return Swal.fire(
        'Atención',
        'Agregue productos a la orden de compra!',
        'warning'
      );
    }

    let i = this.entrada.productos.length;
    if(this.entrada.productos[i - 1].nombre == ''){
      return Swal.fire(
        'Atencíon',
        'Selecciona un producto en la fila ' + i,
        'warning');
    }

    if(this.entrada.productos[this.entrada.productos.length - 1].kg <= 0){
      return Swal.fire(
        'Atencíon',
        'Agregue una cantidad en la fila ' + i,
        'warning');
    }

    for(let o = 0; o < i; o++)
    {
      //Si hay asignada una cantidad y un producto, se verifica la existencia del producto  
      await this.ServicioProducto.buscarProductoEstricto(this.entrada.productos[o].nombre).then(
        (res:any) => {
          //Si el producto existe, se agrega al array, para preparase para su envio a la peticion a la base de datos
          enviar.productos.push({producto: res.producto.uid, cantidad: this.entrada.productos[o].kg});
      }).catch(
        (err: any) => { 
          return this.devolverError(err.error.msg);
      });
    }

    enviar.fechaDeEntrada = this.entrada.fecha;
    enviar.ordenCompra = this.entrada.ordenCompra;
    
    await this.ServicioEntradasProveedor.actualizarEntradaProveedor(this. idEntrada,enviar).subscribe(
    data => {
      console.log(data);
      Swal.fire(
        'Exito',
        'Entrada Actualizada Correctamente',
        'success');
      },
      err => {
        console.log(err)
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
        proveedor.nombre = this.entrada.proveedor;
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
        this.entrada.productos.splice(i, 1);
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
    let i = this.entrada.productos.length;
    if(i == 0){
      this.entrada.productos.push({nombre: '', kg: 0});
    }
    else{
      if(this.entrada.productos[i - 1].nombre == ''){
        return Swal.fire(
          'Atencíon',
          'Selecciona un producto en la fila ' + i,
          'warning');
      }

      if(this.entrada.productos[this.entrada.productos.length - 1].kg <= 0){
        return Swal.fire(
          'Atencíon',
          'Agregue una cantidad en la fila ' + i,
          'warning');
      }
      
      this.entrada.productos.push({nombre: '', kg: 0});
    }
    
    console.log(this.entrada.productos.length);
    console.log(this.entrada.productos[this.entrada.productos.length - 1].nombre);
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
        this.entrada.productos.splice(i, 1);
      }
    });
  }

  async comprobarProducto(nombre: string, i: number){

    if( nombre == ''){
      this.entrada.productos.splice(i, 1);
      return;
    }
    
    //Validacion Producto
    await this.ServicioProducto.buscarProductoEstricto(nombre).then(
      (res:any) => {
        this.entrada.productos[i].id = res.producto.uid;
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
