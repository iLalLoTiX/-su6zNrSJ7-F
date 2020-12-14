import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Producto } from 'app/models/producto.models';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-pesaje',
  templateUrl: './pesaje.component.html',
  styles: []
})
export class PesajeComponent implements OnInit {

  @Input() public productoKilos;
  @Input() public index;

  @Output() cancelar = new EventEmitter();
  @Output() afirmar = new EventEmitter();

  formEntrada: FormGroup;

  esperadoCaja: number;
  cantidadCajas: number;
  pesoCajas: number;
  pesoEsperado: number;
  pesoTarima: number;
  pesoBascula: number;
  pago: number;

  // Variables temporales Pesaje
  destarado: number;
  pesoPorCaja: number;
  diferencia: number;
  pagoTotal: number;

  // dataProducto
  public aceptarProducto = {
    destarado: 0,
    precio: 0,
    index: 0
  };


  constructor(private fb: FormBuilder) {
    console.log(this.productoKilos);
  }

  ngOnInit(): void {
    console.log(this.productoKilos);
    
    this.crearFormulario();
    this.escucharNumeroCajas();
    this.escucharPesoTarima();
    this.escucharPesoBascula();
    this.escucharPesoCajas();
    this.escucharPago();
    this.escucharCxKg();
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      cajas         : [],
      pesoCaja      : [],
      pesoTarima    : [],
      pesoBascula   : [],
      pago          : [],
      CxKg          : [true],
    });
  }

  escucharCxKg(){
    this.formEntrada.get('CxKg').valueChanges.subscribe( CxKg => {
      this.calcularPago(this.formEntrada.get('pago').value);
    });
  } 

  escucharNumeroCajas() {
    this.formEntrada.get('cajas').valueChanges.subscribe( cantidadCajas => {
    this.destarado      = 0;
    this.pesoCajas      = this.formEntrada.get('pesoCaja').value;
    this.pesoTarima     = this.formEntrada.get('pesoTarima').value;
    this.pesoBascula    = this.formEntrada.get('pesoBascula').value;
    
    this.destarado      =  this.pesoBascula - ((cantidadCajas * this.pesoCajas) + this.pesoTarima);
    this.pesoPorCaja    = this.destarado / cantidadCajas;
    
      if(cantidadCajas > 1){
        this.esperadoCaja = this.productoKilos/cantidadCajas;
      }
      else{
        this.esperadoCaja = this.productoKilos;
      }
      
    this.diferencia = this.pesoPorCaja - this.esperadoCaja;
    });
    this.calcularPago(this.formEntrada.get('pago').value);
  }   

  escucharPesoTarima() {
    this.formEntrada.get('pesoTarima').valueChanges.subscribe( pesoTarima => {
    this.destarado = 0;
    this.cantidadCajas = this.formEntrada.get('cajas').value;
    this.pesoCajas = this.formEntrada.get('pesoCaja').value;
    this.pesoBascula = this.formEntrada.get('pesoBascula').value;
    
    this.destarado = this.pesoBascula - ((this.cantidadCajas * this.pesoCajas ) + pesoTarima);
    this.pesoPorCaja = this.destarado / this.cantidadCajas;
    this.diferencia = this.pesoPorCaja - this.esperadoCaja;
    this.calcularPago(this.formEntrada.get('pago').value);
    });
  }
  
  escucharPesoBascula() {
    this.formEntrada.get('pesoBascula').valueChanges.subscribe( pesoBascula => {
    this.destarado = 0;
    this.cantidadCajas = this.formEntrada.get('cajas').value;
    this.pesoCajas = this.formEntrada.get('pesoCaja').value;
    this.pesoTarima = this.formEntrada.get('pesoTarima').value;

    this.destarado = pesoBascula - ((this.cantidadCajas * this.pesoCajas ) + this.pesoTarima)
    this.pesoPorCaja = this.destarado / this.cantidadCajas;
    this.diferencia = this.pesoPorCaja - this.esperadoCaja;
    
    // this.calcularDifDestTotlEsp();
    // this.calcularTotalPago();
    this.calcularPago(this.formEntrada.get('pago').value);
    });
  }

  escucharPesoCajas() {
    this.formEntrada.get('pesoCaja').valueChanges.subscribe( pesoCajas => {
    this.destarado = 0;
    this.cantidadCajas = this.formEntrada.get('cajas').value;
    this.pesoTarima = this.formEntrada.get('pesoTarima').value;
    this.pesoBascula = this.formEntrada.get('pesoBascula').value;
    
    this.destarado = this.pesoBascula - ((this.cantidadCajas * pesoCajas) + this.pesoTarima);
    this.pesoPorCaja = this.destarado / this.cantidadCajas;
    this.diferencia = this.pesoPorCaja - this.esperadoCaja;
    // this.calcularDifDestTotlEsp();
    // this.calcularTotalPago();
    this.calcularPago(this.formEntrada.get('pago').value);
    });
  }

  escucharPago() {
    this.formEntrada.get('pago').valueChanges.subscribe( pagoC => {
      this.calcularPago(pagoC);
    });
  }

  calcularPago(pago: number){
    if(this.formEntrada.get('CxKg').value){
      this.pagoTotal = pago * this.destarado;
    }else{
      this.pagoTotal = pago * this.formEntrada.get('cajas').value;
    }
  }
  
  enviarProducto(){
    if(this.pagoTotal > 0){
      this.aceptarProducto.destarado = this.destarado;
      this.aceptarProducto.precio = this.pagoTotal;
      this.aceptarProducto.index = this.index;
      this.afirmar.emit(this.aceptarProducto);
    }else{
      Swal.fire({
        title: 'Atencion',
        text: 'Completa los campos',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }

  }

  cerrarBascula(){
    this.productoKilos = undefined;
    this.cancelar.emit();
  }

}
