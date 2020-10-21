import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ContactosService } from 'app/services/contactos.service';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { OrdenesService } from 'app/services/ordenes.service';
import { ProductosService } from 'app/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-orden',
  templateUrl: './crear-orden.component.html',
  styles: []
})
export class CrearOrdenComponent implements OnInit {

  
  public orden = {
    proveedor: '',
    productos: new Array(),
    fecha: '',
  };

  public enviar = {
    proveedor: '',
    productos: new Array(),
    fechaDeEntrada: '',
  };

  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)
  public proveedores;
  public prods;

  constructor(
    private ServicioOrden: OrdenesService,
    public ServicioEntradasProveedor: EntradaProveedorService,
    private fb: FormBuilder,
    private ServicioProveedor: ContactosService,
    private ServicioProducto: ProductosService) { }

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
          this.prods = a.productos;
        }).catch((err) => {

        });
      } ,this.doneTypingInterval);
    }
  }

  agregarProducto(){
    this.orden.productos.push({nombre: '', kg: 0});
  }

  comprobarProducto(nombre: string, i: number){
    console.log(i);
    this.orden.productos[i].id = 123123;
    console.log(this.orden.productos[i]);
    if(nombre === ""){
      return Swal.fire(
      'Atención',
      'Selecciona un producto',
      'warning'
    );
    }
    //Validacion Producto
    this.ServicioProducto.buscarProductoEstricto(nombre).then(
      (res:any) => {
        this.orden.productos[i].id = res.producto.uid
        return console.log(this.orden.productos[i]);
    }).catch(
      (err: any) => {  
        return this.devolverError(err.error.msg);
    });
  }

  async crearOrden(){

    this.enviar.productos = new Array();
    //se pregunta si se asigno fecha a la orden de compra
    if(this.orden.fecha == ''){
      return Swal.fire(
        'Atención',
        'Selecciona una fecha',
        'warning'
      );
    }
    //Se prepara la fecha para su envio
    this.enviar.fechaDeEntrada = this.orden.fecha;

    //se pregunta si se asigno proveedor a la orden de compra
    if(this.orden.proveedor == '')
    {
      return Swal.fire(
        'Atención',
        'Selecciona un proveedor',
        'warning'
      );
    }
    
    //Si se ingreso un proveedor, se comprueba si dicho proveedor existe en la base de datos
    await this.ServicioProveedor.buscarContactoEstricto(this.orden.proveedor).then(
      (res:any) => {
        this.enviar.proveedor = res.contacto.uid;
    }).catch(
      (err: any) => {
        //si no se encontro al proveedor en la abse de datos se termina el proceso
        return Swal.fire(
          'Atención',
          err.error.msg,
          'warning'
        );
    });

    //se pregunta si hay productos en la orden de compra
    if(this.orden.productos.length <= 0){
      //Si no hay se cancela la operación y envia un mensaje
      return Swal.fire(
        'Atención',
        'Agregue productos a la orden de compra!',
        'warning'
      );
    }
    //Bandera
    let next: boolean = true;
    for(let i = 0; i < this.orden.productos.length; i++){
      
      //Pregunta si hay una cantidad asignada a esa fila (producto)
      if(this.orden.productos[i].kg <= 0){
        //Si no hay se cancela la operación y envia un mensaje
        Swal.fire(
          'Atención',
          this.orden.productos[i].nombre + ' no tiene cantidad uwu',
          'warning'
        );
        break;
      }
      //Si hay asignada una cantidad y un producto, se verifica la existencia del producto  
      await this.ServicioProducto.buscarProductoEstricto(this.orden.productos[i].nombre).then(
        (res:any) => {
          //Si el producto existe, se agrega al array, para preparase para su envio a la peticion a la base de datos
          this.enviar.productos.push({producto: res.producto.uid, cantidad: this.orden.productos[i].kg});
      }).catch(
        (err: any) => { 
          //Si no no existe el producto se cancela la operación y envia un mensaje 
          next = false;
          return this.devolverError(err.error.msg);
      });
      //Si next es falso, significa que algo salio mal, se cancela la operacion
      if(!next){
        Swal.fire(
          'Atención',
          'La pocición ' + (i + 1) + ' esta vacía',
          'warning'
        );
        break;
      }
    }
    
    // se pregunta si pasa la orden de compra
    if(next){
      this.ServicioOrden.postOrden(this.enviar).subscribe(console.log);
    }

  }

  devolverError(error){
    Swal.fire(
      'Atencíon',
      error,
      'warning');
  }
}
