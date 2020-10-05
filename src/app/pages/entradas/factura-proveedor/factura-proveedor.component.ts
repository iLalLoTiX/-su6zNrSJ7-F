import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlegraService } from '../../../services/alegra.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Proveedor } from 'app/models/proveedor.interface';
import { _Producto } from 'app/models/_producto.interface';

@Component({
  selector: 'app-factura-proveedor',
  templateUrl: './factura-proveedor.component.html',
  styles: []
})
export class FacturaProveedorComponent implements OnInit {
  public proveedor: Proveedor;
  public idProveedor: number;
  public nombreProveedor: string;
  public productos: _Producto [];

  constructor(public AlegraS : AlegraService, private rutaActiva: ActivatedRoute) {
    
    this.inicio();

  }

  async inicio(){
    await this.AlegraS.getProveedor(this.rutaActiva.snapshot.params.id).toPromise().then( (a: any) => {this.proveedor = a}).catch(a => console.log(a));
  }

  ngOnInit(): void {
    this.AlegraS.getProveedor(this.rutaActiva.snapshot.params.id).subscribe( (a: any) => {this.proveedor = a});
  }

  // buscarProductoId(formId: NgForm){
  //   this.AlegraS.getProductoId(formId.controls.idProducto.value).subscribe((a:any) => {this.productos = a; console.log(a)});
  // }

  buscarProductoNombre(formNombre: NgForm){
    this.AlegraS.getProductoName(formNombre.controls.nombreProducto.value).subscribe((a:any) => {this.productos = a; console.log(a)});
  }


}
