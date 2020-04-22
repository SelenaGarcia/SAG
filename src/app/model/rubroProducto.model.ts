export interface RubroProductoData{
    id?: number,
    descripcion: string,
    activo: boolean,
}

export interface RubroProductoDataTable {
    objeto: RubroProductoData[],
    rowCount: number,
}

export interface RubroProductoModal{
    titulo: string,
    operacion: 1 | 2,
    payload: RubroProductoData
}