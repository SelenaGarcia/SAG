export interface CategoriaData{
    id?: number ,
    descripcion: string,
    activo: boolean,
}

export interface CategoriaDataTable{
    objeto: CategoriaData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface CategoriaModal{
    titulo: string,
    operacion: 1 | 2,
    payload: CategoriaData
}
