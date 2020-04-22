export interface FuncionData{
    id?: number ,
    descripcion: string,
    activo: boolean,
}

export interface FuncionDataTable{
    objeto: FuncionData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface FuncionModal{
    titulo: string,
    operacion: 1 | 2,
    payload: FuncionData
}
