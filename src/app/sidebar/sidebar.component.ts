import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    // { path: '/dashboard',           title: 'Dashboard',             icon:'nc-bank',             class: '' },
    { path: '/icons',               title: 'Icons',                 icon:'nc-diamond',          class: '' },
    // { path: '/maps',                title: 'Maps',                  icon:'nc-pin-3',            class: '' },
    // { path: '/notifications',       title: 'Notifications',         icon:'nc-bell-55',          class: '' },
    // { path: '/table',               title: 'Table List',            icon:'nc-tile-56',          class: '' },
    // { path: '/typography',          title: 'Typography',            icon:'nc-caps-small',       class: '' },
    // { path: '/recursoshumanos',     title: 'Recursos Humanos',      icon:'nc-circle-10',        class: '' },
    // { path: '/inventario',          title: 'Inventario',            icon:'nc-app',              class: '' },
    // { path: '/entradas',            title: 'Entradas',              icon:'nc-minimal-down',     class: '' },
    { path: '/entradaProveedor',    title: 'Entradas Proveedor',    icon:'nc-share-66',     class: '' },
    { path: '/contacto',            title: 'Contactos',             icon:'nc-single-02',    class: '' },
    { path: '/productos',           title: 'Productos',             icon:'nc-tag-content',  class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
