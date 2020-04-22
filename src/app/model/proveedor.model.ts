
export interface ProveedorData {
    id?: number,
    razonSocial: string,
    activo: boolean,
    provinciaId?: number,
    provincia: string,
    localidadId?: number,
    localidad: string,
    rubroProveedorId?: number,
    rubroProveedor: string,
    cuit?: string,
    calle?: string,
    telefono?: string,
    email?: string,
    codigoPostal?: string,
    web?: string,
    numero?: string,
    piso?: string,
    oficina?: string,
}



export interface ProveedorDataTable {
    objeto: ProveedorData[],
    rowCount: number,
}


/** operacion: 1 = alta, 2 = modificacion */
export interface ProveedorModal {
    titulo: string,
    operacion: 1 | 2,
    payload: ProveedorData
}
