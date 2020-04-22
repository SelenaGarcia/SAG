export interface AgenteData{
    id?: number,
    localidadId?: number,
    provinciaId?: number,
    sectorId?: number,
    funcionId?: number,
    categoriaId?: number,
    sexoId?: number,
    estadoCivilId?: number,
    tituloId?: number,
    apellido: string,
    nombre: string,
    dni: string,
    cuil: string,
    calle: string,
    numero: number,
    piso: string,
    dpto: string,
    telefono: string,
    codigoPostal: string,
    correoElectronico: string,
    numeroIpss: string,
    fechaNacimiento: string,
    fechaIngreso: string,
    legajo: string,
    sexo: string,
    matricula: string,
    estadoCivil: string,
    localidad: string,
    provincia: string,
    sector: string,
    funcion: string,
    categoria: string,
    activo: boolean,
}

export interface AgenteDataTable {
    objeto: AgenteData[],
    rowCount: number,
}

export interface AgenteModal{
    titulo: string,
    operacion: 1 | 2,
    payload: AgenteData
}