import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';
import { CommonModule }                       from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }                     from '../../pages/dashboard/dashboard.component';
import { UserComponent }                          from '../../pages/user/user.component';
import { TableComponent }                         from '../../pages/table/table.component';
import { TypographyComponent }                    from '../../pages/typography/typography.component';
import { IconsComponent }                         from '../../pages/icons/icons.component';
import { MapsComponent }                          from '../../pages/maps/maps.component';
import { NotificationsComponent }                 from '../../pages/notifications/notifications.component';
import { UpgradeComponent }                       from '../../pages/upgrade/upgrade.component';
import { EntradasComponent }                      from '../../pages/entradas/entradas.component';
import { FacturaCompraComponent }                 from '../../pages/entradas/factura-compra/factura-compra.component';
import { PesajeComponent }                        from '../../pages/entradas/pesaje/pesaje.component';
import { CajasComponent }                         from '../../pages/inventario/cajas/cajas.component';
import { ModalCajasComponent }                    from '../../pages/inventario/cajas/modal-cajas/modal-cajas.component';
import { EmpleadosComponent }                     from '../../pages/recursos-humanos/empleados/empleados.component';
import { EmpleadoComponent }                      from '../../pages/recursos-humanos/empleados/empleado/empleado.component';
import { DepartamentosComponent }                 from '../../pages/recursos-humanos/departamentos/departamentos.component';
import { ModalDepartamentosComponent }            from '../../pages/recursos-humanos/departamentos/modal-departamentos/modal-departamentos.component';
import { RecursosHumanosComponent }               from '../../pages/recursos-humanos/recursos-humanos.component';
import { InventarioComponent }                    from '../../pages/inventario/inventario.component';
import { EntradaCajasComponent }                  from '../../pages/inventario/entrada-cajas/entrada-cajas.component';
import { AdministrarEntradaCajasComponent }       from '../../pages/inventario/entrada-cajas/administrar-entrada-cajas/administrar-entrada-cajas.component';
import { EntradaProveedorComponent }              from '../../pages/entrada-proveedor/entrada-proveedor.component';
import { ContactoComponent }                      from '../../pages/contacto/contacto.component';
import { ProductosComponent }                     from '../../pages/productos/productos.component';
import { ProductoComponent }                      from '../../pages/productos/producto/producto.component';
import { AddProductoComponent }                   from '../../pages/productos/add-producto/add-producto.component';
import { AgregarContactoComponent }               from '../../pages/contacto/agregar-contacto/agregar-contacto.component';
import { ActualizarContactoComponent }            from '../../pages/contacto/actualizar-contacto/actualizar-contacto.component';
import { AgregarEntradaProveedorComponent }       from '../../pages/entrada-proveedor/agregar-entrada-proveedor/agregar-entrada-proveedor.component';
import { ActualizarEntradaProveedorComponent }    from '../../pages/entrada-proveedor/actualizar-entrada-proveedor/actualizar-entrada-proveedor.component';
import { ModalMermar }                            from '../../pages/entrada-proveedor/modal-mermar/modal-mermar.component.';
import { OrdenesComponent }                       from '../../pages/ordenes/ordenes.component';
import { OrdenesFechaComponent }                  from '../../pages/ordenes/ordenes-fecha/ordenes-fecha.component';
import { OrdenesTablaComponent }                  from '../../pages/ordenes/ordenes-tabla/ordenes-tabla.component';
import { CrearOrdenComponent }                    from '../../pages/ordenes/crear-orden/crear-orden.component';
import { EditarOrdenComponent }                   from '../../pages/ordenes/editar-orden/editar-orden.component';
import { AlmacenComponent }                       from '../../pages/almacen/almacen.component';
import { NgbModule }                              from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    AgregarContactoComponent,
    ActualizarContactoComponent,
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    EntradasComponent,
    FacturaCompraComponent,
    PesajeComponent,
    CajasComponent,
    ModalCajasComponent,
    EmpleadosComponent,
    EmpleadoComponent,
    DepartamentosComponent,
    ModalDepartamentosComponent,
    RecursosHumanosComponent,
    InventarioComponent,
    EntradaCajasComponent,
    AdministrarEntradaCajasComponent,
    EntradaProveedorComponent,
    AgregarEntradaProveedorComponent,
    ActualizarEntradaProveedorComponent,
    ContactoComponent,
    ProductosComponent,
    ProductoComponent,
    AddProductoComponent,
    ModalMermar,
    OrdenesComponent,
    CrearOrdenComponent,
    EditarOrdenComponent,
    OrdenesFechaComponent,
    OrdenesTablaComponent,
    AlmacenComponent
  ]
})

export class AdminLayoutModule {}
