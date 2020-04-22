
export interface Menu{
    nombre: string,
    route: string,
    icono: string,
    tieneSubmenu: boolean,
    subMenu?: Menu[]
}
