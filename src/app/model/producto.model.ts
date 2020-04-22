
export interface ProductoData{
    id?: number ,
    descripcion: string,
    activo: boolean,
    rubro?: string,
    rubroId?: number,
}

export interface ProductoDataTable{
    objeto: ProductoData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface ProductoModal{
    titulo: string,
    operacion: 1 | 2,
    payload: ProductoData
}
