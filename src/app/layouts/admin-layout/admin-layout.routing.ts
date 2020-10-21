import { Routes } from '@angular/router';

import { DashboardComponent }                   from '../../pages/dashboard/dashboard.component';
import { UserComponent }                        from '../../pages/user/user.component';
import { TableComponent }                       from '../../pages/table/table.component';
import { TypographyComponent }                  from '../../pages/typography/typography.component';
import { IconsComponent }                       from '../../pages/icons/icons.component';
import { MapsComponent }                        from '../../pages/maps/maps.component';
import { NotificationsComponent }               from '../../pages/notifications/notifications.component';
import { UpgradeComponent }                     from '../../pages/upgrade/upgrade.component';
import { EntradasComponent }                    from '../../pages/entradas/entradas.component';
import { FacturaProveedorComponent }            from '../../pages/entradas/factura-proveedor/factura-proveedor.component';
import { FacturaCompraComponent }               from '../../pages/entradas/factura-compra/factura-compra.component';
import { CajasComponent }                       from '../../pages/inventario/cajas/cajas.component';
import { EmpleadosComponent }                   from '../../pages/recursos-humanos/empleados/empleados.component';
import { EmpleadoComponent }                    from '../../pages/recursos-humanos/empleados/empleado/empleado.component';
import { RecursosHumanosComponent }             from '../../pages/recursos-humanos/recursos-humanos.component';
import { InventarioComponent }                  from '../../pages/inventario/inventario.component';
import { AdministrarEntradaCajasComponent }     from '../../pages/inventario/entrada-cajas/administrar-entrada-cajas/administrar-entrada-cajas.component';
import { EntradaProveedorComponent }            from '../../pages/entrada-proveedor/entrada-proveedor.component';
import { ContactoComponent }                    from '../../pages/contacto/contacto.component';
import { ProductosComponent }                   from '../../pages/productos/productos.component';
import { ProductoComponent }                    from '../../pages/productos/producto/producto.component';
import { AddProductoComponent }                 from '../../pages/productos/add-producto/add-producto.component';
import { AgregarContactoComponent }             from '../../pages/contacto/agregar-contacto/agregar-contacto.component';
import { ActualizarContactoComponent }          from '../../pages/contacto/actualizar-contacto/actualizar-contacto.component';
import { AgregarEntradaProveedorComponent }     from '../../pages/entrada-proveedor/agregar-entrada-proveedor/agregar-entrada-proveedor.component';
import { ActualizarEntradaProveedorComponent }  from '../../pages/entrada-proveedor/actualizar-entrada-proveedor/actualizar-entrada-proveedor.component';
import { RevisarEntradaProveedorComponent }     from '../../pages/entrada-proveedor/revisar-entrada-proveedor/revisar-entrada-proveedor.component';
import { RevisarEntradaEditarComponent }        from '../../pages/entrada-proveedor/revisar-entrada-editar/revisar-entrada-editar.component';
import { OrdenesComponent }                     from '../../pages/ordenes/ordenes.component';
import { CrearOrdenComponent }                  from '../../pages/ordenes/crear-orden/crear-orden.component';
import { EditarOrdenComponent }                 from '../../pages/ordenes/editar-orden/editar-orden.component';


export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',                            component: DashboardComponent },
    { path: 'user',                                 component: UserComponent },
    { path: 'table',                                component: TableComponent },
    { path: 'typography',                           component: TypographyComponent },
    { path: 'icons',                                component: IconsComponent },
    { path: 'maps',                                 component: MapsComponent },
    { path: 'notifications',                        component: NotificationsComponent },
    { path: 'upgrade',                              component: UpgradeComponent },
    { path: 'entradas',                             component: EntradasComponent },
    { path: 'facturarProveedor/:id',                component: FacturaProveedorComponent },
    { path: 'facturarCompra/:id',                   component: FacturaCompraComponent },
    { path: 'cajas',                                component: CajasComponent },
    { path: 'empleados',                            component: EmpleadosComponent },
    { path: 'recursoshumanos',                      component: RecursosHumanosComponent },
    { path: 'empleados/empleado/:id',               component: EmpleadoComponent },
    { path: 'inventario',                           component: InventarioComponent },
    { path: 'inventario/administrarEntradaCajas',   component: AdministrarEntradaCajasComponent },
    
    { path: 'entradaProveedor',                     component: EntradaProveedorComponent },
    { path: 'crearEntradaProveedor',                component: AgregarEntradaProveedorComponent },
    { path: 'actualizarEntradaProveedor/:id',       component: ActualizarEntradaProveedorComponent },
    { path: 'revisarEntradaProveedor/:id',          component: RevisarEntradaProveedorComponent },
    { path: 'editarRevisarEntradaProveedor/:id',    component: RevisarEntradaEditarComponent },

    { path: 'contacto',                             component: ContactoComponent },
    { path: 'productos',                            component: ProductosComponent },
    { path: 'producto/:id',                         component: ProductoComponent },
    { path: 'agregarProducto',                      component: AddProductoComponent },
    { path: 'agregarContacto',                      component: AgregarContactoComponent },
    { path: 'actualizarContacto/:id',               component: ActualizarContactoComponent },
    
    { path: 'ordenesdecompra',                      component: OrdenesComponent },
    { path: 'crearOrden',                           component: CrearOrdenComponent },
    { path: 'editarOrden/:id',                      component: EditarOrdenComponent },
];  
