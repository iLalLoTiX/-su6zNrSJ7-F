import { Component, OnInit } from '@angular/core';
import { ContactosService } from 'app/services/contactos.service';
import { EntradaProveedorService } from 'app/services/entrada-proveedor.service';
import { ProductosService } from 'app/services/productos.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  
  public porcentajeBueno;
  public porcentajeMalo;

  public dineroPerdido: number;
  public dineroInvertido: number;

  public bueno;
  public malo;
  public total;
  
  public primeraFecha;
  public ultimaFecha;

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
  
  public typingTimer;                //timer identifier
  public doneTypingInterval = 300;  //time in ms (5 seconds)

  public busqueda;
  public proveedores;
  public productos;

  public entradasProveedor;
  public desde: number = 0;
  public limite: number = 0;
  
  constructor(
    private ServicioEntradasProveedor: EntradaProveedorService, 
    private ServicioProveedor: ContactosService, 
    private ServicioProducto: ProductosService,
  ) { }

  ngOnInit(): void {
  }

  filtrar(){

    this.enviar.fechaUno = this.filtro.fechaUno;
    this.enviar.fechaDos = this.filtro.fechaDos;
    // Entrada Proveedor
    this.ServicioEntradasProveedor.estadisticaEntradaProveedor(this.enviar, this.desde, this.limite).then((a:any)=> {
      this.entradasProveedor = a.entradasProveedor;
      console.log(a.entradasProveedor);
      this.bueno = a.kg;
      this.malo = a.merma;
      this.total = a.total;

      this.graficaPastel(this.bueno, this.malo);
      this.porcentajeMalo = (this.malo / this.total);
      this.porcentajeBueno = (this.bueno / this.total);
console.log(this.porcentajeMalo);
      this.dineroPerdido = (this.porcentajeMalo * 100) / 100 * a.dinero;
      this.dineroInvertido = a.dinero;
      
      this.primeraFecha = this.entradasProveedor[this.entradasProveedor.length - 1].fechaDeEntrada; 
      this.ultimaFecha = this.entradasProveedor[0].fechaDeEntrada;

    }).catch((a:any)=> {console.log(a);});
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

  devolverError(error){
    Swal.fire(
      'Atencíon',
      error,
      'warning');
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
            data: [ malo, bueno  ]
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
}
