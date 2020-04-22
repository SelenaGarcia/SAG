export interface RubroProveedorData{
    id?: number,
    descripcion: string,
    activo: boolean,
}

export interface RubroProveedorDataTable {
    objeto: RubroProveedorData[],
    rowCount: number,
}

export interface RubroProveedorModal{
    titulo: string,
    operacion: 1 | 2,
    payload: RubroProveedorData
}