import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ContactosService } from 'app/services/contactos.service';
import { ProductosService } from 'app/services/productos.service';

@Component({
  selector: 'app-modal-filtrar-entrada-proveedor',
  templateUrl: './modal-filtrar-entrada-proveedor.component.html',
  styles: []
})
export class ModalFiltrarEntradaProveedorComponent implements OnInit {

  @Input() public closeModal;
  
  public formEntrada;
  
  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public busqueda;
  public proveedores;
  public productos;

  public filtro = {
    proveedor: '',
    producto: '',
    fechaUno: '',
    fechaDos: '',
  }
  
  constructor(private router: Router, 
    private ServicioProveedor: ContactosService, 
    private ServicioProducto: ProductosService) {
  }

  ngOnInit(): void {
  }

  salir(){
    this.closeModal.dismissAll();
  }

  filtrar(){
    this.closeModal.dismissAll();
    this.router.navigate(['/resultEntradaProveedor'], {state: this.filtro});
  }

  buscarProveedorInput($event){
    this.busqueda = $event.target.value;
    clearTimeout(this.typingTimer);
    if ($event.target.value) {
      this.typingTimer = setTimeout(() => {
        this.ServicioProveedor.buscarContacto(this.filtro.proveedor).then((a: any) => {
          this.proveedores = a.contactos;
        }).catch((err) => {
          
        });
      } ,this.doneTypingInterval);
    }
  }

  buscarProductoInput($event){
    this.busqueda = $event.target.value;
    clearTimeout(this.typingTimer);
    if ($event.target.value) {
      this.typingTimer = setTimeout(() => {
        this.ServicioProducto.buscarProducto(this.filtro.producto).then((a: any) => {
          this.productos = a.productos;
        }).catch((err) => {
          
        });
      } ,this.doneTypingInterval);
    }
  }

}
