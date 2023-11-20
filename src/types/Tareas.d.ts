export interface Tarea {
    _id?:string
    nombre:string
    descripcion:string
    estado?: boolean,
    fechaEntrega: Date,
    prioridad: string,
    proyecto?: string
}