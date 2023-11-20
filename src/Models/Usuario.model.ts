import { Usuario } from "../types/Usuarios";

export class UsuarioModel implements Usuario {
    nombre: string;
    password: string;
    email: string;
    token: string;
    confirmado: boolean;
    _id: string;
    
    constructor() {
        this.nombre = '';
        this.password= '';
        this.email = '';
        this.confirmado = false;
        this._id='';
        this.token= ''
    }
}