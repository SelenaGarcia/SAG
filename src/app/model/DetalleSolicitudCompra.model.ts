export interface DetalleSolicitudCompraData{
    id?: number,
    solicitudCompraId?: number,   
    detalle: DetalleSolicitudCompraTable[] 
}

export interface SolicitudCompraTable {
    objeto: DetalleSolicitudCompraData[],
    rowCount: number,
}

export interface DetalleSolicitudCompraModal{
    titulo: string,
    operacion: 1 | 2,
    payload: DetalleSolicitudCompraData
}

export interface DetalleSolicitudCompraTable
{
    cantidad: number,
    productodesc: string,
    caracteristica: string,
    disponible: boolean,   
    id: number, 
}