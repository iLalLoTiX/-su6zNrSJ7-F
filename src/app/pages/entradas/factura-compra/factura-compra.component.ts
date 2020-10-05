import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlegraService } from 'app/services/alegra.service';
import { Orden } from 'app/models/orden.interface';
import { _Producto } from 'app/models/_producto.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { Producto } from 'app/models/producto.models';

@Component({
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styles: []
})
export class FacturaCompraComponent implements OnInit {

  public SKU;
  public ref;
  public orden: Orden;
  public producto: _Producto;
  public prepararProducto: _Producto;
  public index: number;
  public item : any [] = [];
  public factura  = {
    date: '',
    dueDate: '',
    provider: {
      id: null,
    },
    purchases: {
      items: [
        
      ]
    }
  };
  public temporal  = {
    provider: {
      id: '',
      name: ''
    },
    purchases: {
      items: [
        
      ]
    }
  };
  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  constructor( public AlegraS : AlegraService, private rutaActiva: ActivatedRoute, private router: Router, private modalService: NgbModal) { 
    if (localStorage.getItem(this.rutaActiva.snapshot.params.id) === null) {
      AlegraS.getOrdenId(this.rutaActiva.snapshot.params.id).subscribe((a: Orden) => {
        this.orden = a ;
        for(let i = 0; i<this.orden.purchases.items.length; i++ ){
          this.orden.purchases.items[i].status = false;
        }
        console.log(this.orden.purchases.items);
      });
    }else{
      this.orden = JSON.parse(localStorage.getItem(this.rutaActiva.snapshot.params.id));
      console.log(this.orden.purchases.items);
    }
    
  }

  ngOnInit(): void {
  }

  seleccionarProducto(producto: _Producto, i: number) {
    this.producto = producto;
    this.index = i;
    console.log(this.producto);
  }
  // OutPut ----- Inicio
  afirmar(producto: _Producto){
    this.orden.purchases.items[this.index].quantity = producto.quantity;
    this.orden.purchases.items[this.index].price = producto.price;
    this.orden.purchases.items[this.index].total = producto.price * producto.quantity;
    this.orden.purchases.items[this.index].status = true;
    this.index = undefined;
    this.producto = undefined;
    this.guardarLocalStorage();
  }

  reiniciar(){
    localStorage.removeItem(this.rutaActiva.snapshot.params.id);
    this.AlegraS.getOrdenId(this.rutaActiva.snapshot.params.id).subscribe((a: Orden) => {
      this.orden = a ;
      for(let i = 0; i<this.orden.purchases.items.length; i++ ){
        this.orden.purchases.items[i].status = false;
      }
      console.log(this.orden.purchases.items);
    });
  }

  agregarProducto(){
    console.log(this.SKU);
    if(isNaN(this.SKU))
    {
      return this.swalWithBootstrapButtons.fire(
        'Error',
        'introduce un SKU valido',
        'error'
      )
    }
    this.AlegraS.getProductoId(this.SKU).then((a: any) => 
        {
          if(a.length === 0){
            this.swalWithBootstrapButtons.fire(
              'Error',
              'No existe el producto',
              'info'
            );
          }else{
            console.log(a);
            this.orden.purchases.items.splice(this.orden.purchases.items.length,0,{id:a[0].id, name: a[0].name, reference: a[0].reference, status: false});
            console.log(this.orden.purchases.items); 
          }
        }
      ).catch(a => 
      this.swalWithBootstrapButtons.fire(
        'Error',
        'Hubo un error inesperado, pongase en contacto con el maestro del calabozo',
        'error'
      ));
  }

  cancelar(){
    console.log('cancelar');
    this.producto = undefined;
  }
  // OutPut ----- FIN

  /******************
   * 
   * ACION BOTONES
   *                 
   ******************/

   //Acción final - facturar la orden dara de alta el producto en el sistema

  facturarProveedor()
  {
    let bandera: boolean = false;
    for(let i = 0; i<this.orden.purchases.items.length; i++ )
    {
      if(this.orden.purchases.items[i].status === false){
        bandera = false;
        break;
      }
      else{
        bandera = true;
        this.prepararProducto = new Producto();
        this.prepararProducto.uid = this.orden.purchases.items[i].uid;
        this.prepararProducto.quantity = this.orden.purchases.items[i].quantity;
        this.prepararProducto.price = this.orden.purchases.items[i].total / this.orden.purchases.items[i].quantity;
        this.factura.purchases.items.push(this.prepararProducto);
      }
    }
    
    if(bandera == true)
    {
      this.swalWithBootstrapButtons.fire({
        title: 'Estas seguro que quieres agregar estos productos al inventario?',
        text: "No podras deshacer estos cambios",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'No, haré cambios',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          const d = new Date()
          const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
          const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d)
          const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

          this.factura.date = `${da}-${mo}-${ye}`;
          this.factura.dueDate = `${da}-${mo}-${ye}`;
          this.factura.provider.id = this.orden.provider.id;
          this.AlegraS.postFacturaProveedor(this.factura).then(
            a => {
              console.log(this.factura);
              localStorage.removeItem(this.rutaActiva.snapshot.params.id);
              this.router.navigateByUrl('/entradas');
              this.swalWithBootstrapButtons.fire(
                'Listo',
                'Tus productos se han agregado al inventario',
                'success'
              )
            }
            ).catch(
              
              a => {
                this.swalWithBootstrapButtons.fire(
                  'Error',
                  'Lo sentimos hubo un error :(, ponte en contacto con el maestro del calabozo',
                  'error'
                )
              }
              );
          
        } 
      })
      
      
    }else
    {
      Swal.fire({
        title: '¡Atención!',
        text: 'Debes aprobar todos los productos',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      this.factura.purchases.items = [];
      console.log(this.factura);
    }    
  }

  // Solo hay que agregar la cantidad y el precio y se preparará el producto para ser enviado
  directo(index: number){
    this.orden.purchases.items[index].status = true;
    this.guardarLocalStorage();
  }

  // Es para sacar el producto 
  deshacer(i: number){
    if(this.orden.purchases.items[i].status === true){
      this.orden.purchases.items[i].status = false;
      this.guardarLocalStorage();
    }
  }

  agregar(producto,i: number){
    this.orden.purchases.items.splice(i + 1,0,{id:producto.id, name: producto.name, reference: producto.reference, status: false});
    console.log(this.orden.purchases.items);
  }

  eliminar(i: number){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro que quieres eliminar este producto de la orden de compra?',
      text: "No podras deshacer estes cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if(result.value){
        this.orden.purchases.items.splice(i,1);
        swalWithBootstrapButtons.fire(
          'Listo',
          'Tus productos se han agregado al inventario',
          'success'
        )
      }
      
    }).catch( a => {
      swalWithBootstrapButtons.fire(
        'Error',
        'Lo sentimos hubo un error :(, ponte en contacto con el maestro del calabozo',
        'error'
      )
    });
  }

  guardarLocalStorage(){
    
    for(let i = 0; i<this.orden.purchases.items.length; i++ )
    {
      this.prepararProducto = new Producto();
      this.prepararProducto.uid = this.orden.purchases.items[i].id;
      this.prepararProducto.quantity = this.orden.purchases.items[i].quantity;
      this.prepararProducto.name = this.orden.purchases.items[i].name;
      this.prepararProducto.price = this.orden.purchases.items[i].total / this.orden.purchases.items[i].quantity;
      this.prepararProducto.status = this.orden.purchases.items[i].status;
      this.prepararProducto.total = this.orden.purchases.items[i].total;
      this.temporal.purchases.items.push(this.prepararProducto);
      this.temporal.provider.id = this.orden.provider.id;
      this.temporal.provider.name = this.orden.provider.name;
      localStorage.setItem(this.rutaActiva.snapshot.params.id, JSON.stringify(this.temporal));
    }
    this.temporal.purchases.items = [];
  }

}
