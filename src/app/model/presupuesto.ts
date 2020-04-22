 
export interface PresupuestoData{
    id?: number ,
    numeroPresupuesto: number,
    solicitudCompraId: number,
    proveedorId: number,
    proveedor:string,
    fecha: string,
    fechaVencimiento: string,
    total: number,
    activo: boolean, 
}

export interface PresupuestoDataTable{
    objeto: PresupuestoData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface PresupuestoModal {
    titulo: string,
    operacion: 1 | 2,
    payload: PresupuestoData
}