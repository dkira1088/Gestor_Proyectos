import { Tarea } from "./Tareas"
import { Usuario } from "./Usuarios"

export interface Proyecto {
    nombre:string,
    descripcion:string
    fechaEntrega:Date
    cliente: string 
    tareas?: Array<Tarea>
    colaboradores?: Arrray<Usuario>
    _id?:string
}