export interface SolicitudCompraData {
    id?: number,
    sectorId: number,
    usuarioId: number,
    estadoSolicitudCompra: string,
    agenteId: number,
    // fechaDesde: string,
    // fechaHasta: string,
    numero: number,
    fechaRegresoColegio: string,
    motivoRechazo: string,
    fecha: string,
    fechaAprobacion: string,
    fechaRechazo: string,
    fechaFirma: string,
    fechaEnvioColegio: string,
    activo: boolean,

}

export interface solicitudDataTabla {
    objeto: SolicitudCompraData[],
    rowCount: number,
}

export interface SolicitudCompraModal {
    titulo: string,
    operacion: 1 | 2,
    payload: SolicitudCompraData
}

