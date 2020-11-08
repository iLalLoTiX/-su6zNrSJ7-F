import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ContactosService } from 'app/services/contactos.service';
import { ProductosService } from 'app/services/productos.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entrada-proveedor',
  templateUrl: './entrada-proveedor.component.html',
  styles: []
})
export class EntradaProveedorComponent implements OnInit {
  
  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;

  public entradasProveedor;
  public desde: number = 0;
  public limite: number = 0;
  public bueno: number;
  public malo: number;
  public params;
  
  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public busqueda;
  public proveedores;
  public productos;

  public porcentajeBueno;
  public porcentajeMalo;
  
  public pasa = true;

  public filtro = {
    proveedor: '',
    producto: '',
    fechaUno: '',
    fechaDos: '',
  }

  public enviar = {
    proveedor: '',
    producto: '',
    fechaUno: '',
    fechaDos: '',
  }

  public merma;

  constructor(
    private ServicioEntradasProveedor: EntradaProveedorService, 
    private router: Router, 
    private ServicioProveedor: ContactosService, 
    private ServicioProducto: ProductosService,
    private modalService: NgbModal) {
      this.ServicioEntradasProveedor.getEntradasProveedor().then((a:any) => {
        this.entradasProveedor = a.entrada;
        console.log(a);
      }).catch((a:any) => {console.log(a);});
  }

  open(content, producto) {
    this.merma = producto.noIdoneo;
    this.modalService.open(content);
  }

  refrescarEntradaProveedor(){
    this.ServicioEntradasProveedor.getEntradasProveedor().then((a:any) => {
      this.entradasProveedor = a.entradasProveedor;
    }).catch((a:any)=> {console.log(a);});
  }

  buscarContactoEstricto(){
    if(this.filtro.proveedor === ""){
      this.enviar.proveedor = "";
      return;
    }
    //Validacion proveedor
    this.ServicioProveedor.buscarContactoEstricto(this.filtro.proveedor).then(
      (res:any) => {
        this.enviar.proveedor = res.contacto.uid;
    }).catch(
      (err: any) => {  
        this.enviar.proveedor = "";
        return this.devolverError(err.error.msg);
    });
  }

  buscarProductoEstricto(){
    if(this.filtro.producto === ""){
      this.enviar.producto = "";
      return;
    }
    //Validacion Producto
    this.ServicioProducto.buscarProductoEstricto(this.filtro.producto).then(
      (res:any) => {
        this.enviar.producto = res.producto.uid;
    }).catch(
      (err: any) => {  
        this.enviar.producto = "";
        return this.devolverError(err.error.msg);
    });
  }

  filtrar(){

    this.enviar.fechaUno = this.filtro.fechaUno;
    this.enviar.fechaDos = this.filtro.fechaDos;
    console.log(this.enviar);
    // Entrada Proveedor
    this.ServicioEntradasProveedor.filtrarEntradaProveedor(this.enviar, this.desde, this.limite).then((a:any)=> {
      this.entradasProveedor = a.entradasProveedor;
      this.graficaPastel(a.malo, a.kgTotal);
      this.porcentajeMalo = a.malo / a.kgTotal;
      this.porcentajeBueno = 1 - this.porcentajeMalo;
      
      console.log(a.kgTotal);
      console.log(a.malo);
      console.log(this.porcentajeBueno);
      console.log(this.porcentajeMalo);
    }).catch((a:any)=> {console.log(a);});
  }
  
  cambiarPagina(valor: number){
    this.desde += valor;
    if(this.desde < 0){
      this.desde = 0;
    }
    this.filtrar();
  }
  
  revisarEntradaProveedor(id: string){
    this.router.navigate(['revisarEntradaProveedor/' + id]);
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
  
  crearEntradaProveedor(){
    this.router.navigate(['crearEntradaProveedor/nuevaEntrada']);
  }

  actualizarEntradaProveedor(id: string){
    this.router.navigate(['actualizarEntradaProveedor/' + id]);
  }
  
  editarRevisarEntradaProveedor(id: string){
    console.log('uwu');
    this.router.navigate(['editarRevisarEntradaProveedor/' + id]);
  }

  borrarEntradaProveedor(id: string, i: number){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Borrar este Contacto no se podra deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ServicioEntradasProveedor.deleteEntradaProveedor(id).then(a=>{
          
          this.entradasProveedor.splice(i,1);
          return Swal.fire(
            'Exito',
            'El contacto ha sido borrado',
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

  ngOnInit(): void {
      
  }

  graficaPastel(bueno: number, malo: number){
    this.canvas = document.getElementById("chartEmail");
      this.ctx = this.canvas.getContext("2d");
      this.chartEmail = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            label: "Emails",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: [
              '#ef8157',
              '#4acccd'
            ],
            borderWidth: 0,
            data: [bueno, malo  ]
          }]
        },

        options: {

          legend: {
            display: false
          },

          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent"
              },
              ticks: {
                display: false,
              }
            }]
          },
        }
      });
  }

  devolverError(error){
    Swal.fire(
      'Atencíon',
      error,
      'warning');
  }

}
