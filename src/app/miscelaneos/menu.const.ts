import { Menu } from '../model/menu.model';
import { Observable, of } from 'rxjs';

const MENU_ITEMS: Menu[] = [
     
    {
        nombre: "Solicitud de Compras",
        route: "/sol-compra",
        icono: "attach_file",
        tieneSubmenu: false
    },
    {
        nombre: " Orden de Pago",
        route: "orden-pago",
        icono: "folder",
        tieneSubmenu: false
    },
    {
        nombre: "Configuración",
        icono: "settings",
        route: "",
        tieneSubmenu: true,
        subMenu: [
            {
                nombre: "Rubro de Proveedores",
                icono: "info",
                route: "/rubro-proveedor",
                tieneSubmenu: false
            },
            {
                nombre: "Proveedores",
                icono: "info",
                route: "/proveedor",
                tieneSubmenu: false
            },
            {
                nombre: "Rubro de Producto",
                icono: "info",
                route: "/rubro-producto",
                tieneSubmenu: false
            },
            {
                nombre: "Producto",
                icono: "info",
                route: "/producto",
                tieneSubmenu: false
            },
            {
                nombre: "Agente",
                route: "/agente",
                icono: "info",
                tieneSubmenu: false
            },
            {
                nombre: "Sector",
                icono: "info",
                route: "/sector",
                tieneSubmenu: false
            },
            {
                nombre: "Cuenta",
                icono: "info",
                route: "/cuenta",
                tieneSubmenu: false
            },
            {
                nombre: "Función",
                icono: "info",
                route: "/funcion",
                tieneSubmenu: false
            },
            {
                nombre: "Datos del Colegio de Escribanos",
                icono: "info",
                route: "/datos-colegio-escribano",
                tieneSubmenu: false
            },
            {
                nombre: "Categoria",
                icono: "info",
                route: "/categoria",
                tieneSubmenu: false
            },
            {
                nombre: "Seguridad",
                icono: "info",
                route: "/seguridad",
                tieneSubmenu: false
            },
            
         
        ]
    },
    {
        nombre: "Informes",
        icono: "",
        route: "",
        tieneSubmenu: true,
        subMenu: [
            {
                nombre: "Informe1",
                icono: "",
                route: "/holi1",
                tieneSubmenu: false
            },
            {
                nombre: "Informe2",
                icono: "",
                route: "/holi2",
                tieneSubmenu: false
            }
        ]
    }
];

export function getMenu(): Observable<Menu[]>
{
    return of(MENU_ITEMS);
}