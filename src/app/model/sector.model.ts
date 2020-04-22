export interface SectorData{
    id?: number ,
    descripcion: string,
    activo: boolean,
}

export interface SectorDataTable{
    objeto: SectorData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface SectorModal{
    titulo: string,
    operacion: 1 | 2,
    payload: SectorData
}
