import React, { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import { Usuario } from "../types/Usuarios";
import { Props } from "../types/CommonTypes";


interface ContextState {
  auth: Usuario,
  cargando: boolean,
  setAuth: React.Dispatch<React.SetStateAction<Usuario>>
}

const INITIAL_VALUES = {
  usuario:{
    confirmado:false,
    email:'',
    nombre:'',
    _id: '',
    password: '',
    token: ''
  }
}


const AuthContext = createContext<ContextState|undefined>(undefined);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<Usuario>(INITIAL_VALUES.usuario);
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        setCargando(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await clienteAxios("/usuarios/perfil", config);
        console.log(data);
        setAuth(data);
        navigate("/proyectos");
      } catch (error) {
        setAuth(INITIAL_VALUES.usuario);
      } finally {
        setCargando(false);
      }
    };
    autenticarUsuario();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        cargando,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
