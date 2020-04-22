export interface CuentaData{
    id?: number ,
    descripcion: string,
    numero:string,
    activo: boolean,
}

export interface CuentaDataTable{
    objeto: CuentaData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface CuentaModal{
    titulo: string,
    operacion: 1 | 2,
    payload: CuentaData
}
