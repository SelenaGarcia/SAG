export interface Dialogo{
    titulo: 'Atención' | 'Error' | 'Mensaje' | undefined,
    icono: 'warning' | 'error' | 'done' | undefined,
    estado: boolean | undefined,
    mensaje: string | undefined 
}