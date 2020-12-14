import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DestinosMermaService } from 'app/services/destinos-merma.service';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-mermar',
  templateUrl: './modal-mermar.component.html',
  styles: []
})
export class ModalMermar implements OnInit {

  @Input() public closeModal;
  @Input() public merma;
  @Input() public dataEntrada;
  
  public formEntrada;
  
  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public busqueda;
  public proveedores;

  public mermas: any = new Array();

  public destinos = new Array();
  
  constructor(
    private router: Router, 
    private ServicioMermar: DestinosMermaService,
    private ServicioEntradaMerma: EntradaProveedorService,) {
  }

  ngOnInit(): void {
    console.log(this.dataEntrada);
    console.log(this.merma);
    if(this.merma.length > 0){
      
      for(let i = 0; i < this.merma.length; i++){
        console.log('uwu');
        this.mermas.push({
          destino: this.merma[i].destino.destino,
          cantidad: this.merma[i].cantidad,
          id: this.merma[i].destino._id
        })
      } 
    }
  }

  salir(){
    this.closeModal.dismissAll();
  }

  filtrar(){
    this.closeModal.dismissAll();
  }

  buscar($event){
    this.busqueda = $event.target.value;
    clearTimeout(this.typingTimer);
    if ($event.target.value) {
      this.typingTimer = setTimeout(() => {
        this.ServicioMermar.buscarDestinos($event.target.value).subscribe(
          (a:any) => {this.destinos = a.destinos; console.log(this.destinos);}
        );
      } ,this.doneTypingInterval);
    }
  }

  anadirFila(){
    let i = this.mermas.length;
    if(i == 0){
      this.mermas.push({destino: '', cantidad: 0});
    }
    else{
      if(this.mermas[i - 1].destino == ''){
        return Swal.fire(
          'Atencíon',
          'Selecciona un producto en la fila ' + i,
          'warning');
      }

      if(this.mermas[this.mermas.length - 1].cantidad < 0){
        return Swal.fire(
          'Atencíon',
          'Agregue una cantidad en la fila ' + i,
          'warning');
      }
      
      this.mermas.push({destino: '', cantidad: 0});
    }
  }

  async comprobarDestino(destino, i){
    if( destino == ''){
      this.mermas.splice(i, 1);
      return;
    }
    await this.ServicioMermar.buscarDestinoEstricto(destino).subscribe(
      (res:any) => {

    },
      (err: any) => {  
        return this.errorProveedor(destino, i);
    });
  }

  devolverError(error){
    Swal.fire(
      'Atencíon',
      error,
      'warning');
  }

  errorProveedor(destino, i){
    Swal.fire({
      title: 'Atencion',
      text: "El destino solicitado no existe ¿Quieres crearlo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Crearlo',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        const proveedor = {destino: ''}; 
        proveedor.destino = destino;
        console.log(proveedor);
        this.ServicioMermar.postDestino(proveedor).subscribe(a=>{
          return Swal.fire(
            'Exito',
            'Se ha creado el proveedor',
            'success'
          );
        }, a => {
          console.log(a);
          return Swal.fire(
            'Error',
            'Hubo un error ponganse en contacto con el maestro del calabozo',
            'error'
          );
        });
      }
      else{
        this.mermas.splice(i, 1);
      }
    });
  }

  eliminarDestino(i){
    Swal.fire({
    text: 'Quieres borrar este destino de la orden?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrarlo',
    cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.mermas.splice(i, 1);
      }
    });
  }

  mermar(){
    this.ServicioEntradaMerma.mermarEntradaProveedor(this.dataEntrada, this.mermas).subscribe(
      (a:any)=>{
        Swal.fire(
          'Exito',
          '',
          'success'
        );
        this.closeModal.dismissAll();
      },

      (error)=>{console.log(error);}
      
    );
  }
}
