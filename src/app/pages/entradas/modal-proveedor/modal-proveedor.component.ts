import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlegraService } from '../../../services/alegra.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent implements OnInit {
  
  @Input() public closeModal;

  public proveedores: any [];
  public idProveedor: number;
  public nombreProveedor: string;

  constructor(public AlegraS : AlegraService, private router: Router) {
  }

  ngOnInit(): void {
    
  }

  salir(){
    this.closeModal.dismissAll();
  }

  buscarProveedor(form: NgForm){
    console.log(form.controls.idProveedor.value);
    this.AlegraS.getProveedores(form.controls.idProveedor.value).subscribe((a: any) => {this.proveedores = a; console.log(this.proveedores);});
  }

  seleccionarProveedor(id: number, name: string){
    this.salir();
    this.router.navigateByUrl('/facturarProveedor/' + id );
  }

}
