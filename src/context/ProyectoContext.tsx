import React, { createContext, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import { ErrorResponse, useNavigate } from "react-router-dom";
import delay from "../helpers/delayHelper";
import { Alerta, Props } from "../types/CommonTypes";
import { Proyecto } from "../types/Proyectos";
import { Tarea } from "../types/Tareas";
import { Usuario } from "../types/Usuarios";
import axios, {AxiosError} from "axios";

interface ContextState {
  proyectos: Array<Proyecto>
  alerta: Alerta
  proyecto: Proyecto 
  cargando: boolean
  modalFormularioTarea:boolean
  tarea: Tarea,
  modalEliminarTarea: boolean
  colaborador: Usuario 
  modalEliminarColaborador: boolean
  mostrarAlerta: (alerta: Alerta) => Promise<void>
  submitProyecto: (proyecto: Proyecto) => Promise<void>
  obtenerProyecto: (id: string) => Promise<void>
  eliminarProyecto: (id: string) => Promise<void>
  setProyectos: React.Dispatch<React.SetStateAction<Proyecto[]>>
  handleModalTarea : () => void
  submitTarea: (tarea: Tarea) => Promise<void>
  handleModalEditarTarea: (tarea: Tarea) => void
  handleEliminarTarea: (id: string) => Promise<void>,
  handleModalEliminarTarea: (tarea: Tarea) => void,
  submitColaborador: (email: string) => Promise<void>
  agregarColaborador:(email: string) => Promise<void>,
  handleModalEliminarColaborador: (colaborador: Usuario) => void
  handleEliminarColaborador: (id: string) => Promise<void>,
  setColaborador: React.Dispatch<React.SetStateAction<Usuario>>
}

const INITIAL_VALUES = {
  colaborador:{
    confirmado:false,
    email:'',
    nombre:'',
    _id: '',
    password: '',
    token: ''
  },
  proyecto: {
    descripcion:'',
    fechaEntrega: new Date,
    nombre:'',
    cliente:''
    },
  tarea: {
    _id:'',
    descripcion: '',
    estado: false,
    fechaEntrega: new Date,
    nombre: '',
    prioridad: '',
    proyecto: ''
  }
}

const ProyetoContext = createContext<ContextState|undefined>(undefined);

const ProyectoProvider:  React.FC<Props> =  ({ children }) => {
  const [proyectos, setProyectos] = useState<Array<Proyecto>>([]);
  const [alerta, setAlerta] = useState<Alerta>({});
  const [proyecto, setProyecto] = useState<Proyecto>(INITIAL_VALUES.proyecto);
  const [cargando, setCargando] = useState<boolean>(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState<boolean>(false);
  const [modalEliminarTarea, setModalEliminarTarea] = useState<boolean>(false);
  const [tarea, setTarea] = useState<Tarea>(INITIAL_VALUES.tarea);
  const [colaborador, setColaborador] = useState<Usuario>(INITIAL_VALUES.colaborador);
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);
  const navigate = useNavigate();

  const obtenerConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    return config;
  };

  const mostrarAlerta = async (alerta: Alerta) => {
    setAlerta(alerta);
    await delay(3000);
    setAlerta({});
  };

  const editarProyecto = async (proyecto:Proyecto) => {
    try {
      const config = obtenerConfig();
      if (!config) return;

      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto._id}`,
        proyecto,
        config
      );

      setAlerta({ msg: "Proyecto actualizado correctamente", error: false });

      await delay(1000);

      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );

      setProyectos(proyectosActualizados);
      setAlerta({
        msg: "Proyecto actualizado correctamente",
        error: false,
      });

      navigate("/proyectos");
    } catch (error) {
      console.log(error);
    }
  };

  const crearProyecto = async (proyecto:Proyecto) => {
    try {
      const config = obtenerConfig();
      if (!config) return;
      const { data } = await clienteAxios.post("/proyectos", proyecto, config);

      setAlerta({ msg: "Proyecto creado correctamente", error: false });

      await delay(1000);

      setProyectos([...proyectos, data]);
      setAlerta({});
      navigate("/proyectos");
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarProyecto = async (id:string) => {
    try {
      const config = obtenerConfig();
      if (!config) return;

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );

      setProyectos(proyectosActualizados);
      setAlerta({
        msg: data.msg,
        error: false,
      });

      await delay(2000);

      navigate("/proyectos");
    } catch (error) {
      console.log(error);
    }
  };
  const submitProyecto = async (proyecto:Proyecto) => {
    if (proyecto._id) {
      await editarProyecto(proyecto);
    } else {
      await crearProyecto(proyecto);
    }
  };

  const obtenerProyecto = async (id:string) => {
    try {
      const config = obtenerConfig();
      if (!config) return;

      setCargando(true);
      setAlerta({});

      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      setProyecto(data);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea(INITIAL_VALUES.tarea);
  };

  const submitTarea = async (tarea: Tarea) => {
    try {
      if (tarea._id) {
        await editarTarea(tarea);
      } else {
        await crearTarea(tarea);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const crearTarea = async (tarea:Tarea) => {
    const config = obtenerConfig();
    if (!config) return;
    try {
      const { data } = await clienteAxios.post<Tarea>("/tareas", tarea, config);

      setAlerta({ msg: "Se creó correctamente la tarea", error: false });
      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.tareas = [...(proyecto.tareas || []), data];
      setProyecto(proyectoActualizado);
      setModalFormularioTarea(false);

      await delay(3000);
      setAlerta({});
    } catch (error) {
      console.log(error);
    }
  };

  const editarTarea = async (tarea:Tarea) => {
    const config = obtenerConfig();
    if (!config) return;
    try {
      const { data } = await clienteAxios.put(
        `/tareas/${tarea._id}`,
        tarea,
        config
      );

      setAlerta({ msg: "Se editó correctamente la tarea", error: false });
      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.tareas = proyectoActualizado.tareas?.map(
        (tareaState) => {
          return tareaState._id === data._id ? data : tareaState;
        }
      );
      setProyecto(proyectoActualizado);
      setModalFormularioTarea(false);

      await delay(3000);
      setAlerta({});
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEditarTarea = (tarea: Tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const handleEliminarTarea = async (id:string) => {
    const config = obtenerConfig();
    if (!config) return;

    try {
      const { data } = await clienteAxios.delete(`/tareas/${id}`, config);

      setAlerta({ msg: data.msg, error: false });

      const proyectoActualizado = { ...proyecto };

      proyectoActualizado.tareas = proyectoActualizado.tareas?.filter(
        (tareaState) => tareaState._id !== id
      );

      setProyecto(proyectoActualizado);
      setModalEliminarTarea(false);
      await delay(3000);
      setAlerta({});
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEliminarTarea = (tarea:Tarea) => {
    if (tarea) {
      setTarea(tarea);
    }
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const handleModalEliminarColaborador = (colaborador: Usuario) => {
    console.log(colaborador);
    if (colaborador !== undefined) {
      setColaborador(colaborador);
    }
    setModalEliminarColaborador(!modalEliminarColaborador);
  };

  const submitColaborador = async (email:string) => {
    const config = obtenerConfig();
    if (!config) return;

    setCargando(true);
    try {
      const { data } = await clienteAxios.post(
        "/proyectos/colaboradores",
        {
          email,
        },
        config
      );

      setColaborador(data);
    } catch (error) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          setAlerta({
            msg: error?.response?.data.msg,
            error: true,
          });
        }
      } else {
        console.error('Generic Error:', error);
      }

 
    } finally {
      setCargando(false);
      await delay(10000);
      setAlerta({});
    }
  };

  const agregarColaborador = async (email:string) => {
    const config = obtenerConfig();
    if (!config) return;

    setCargando(true);
    try {
      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores/${proyecto._id}`,
        {email},
        config
      );

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setColaborador(INITIAL_VALUES.colaborador);
    } catch (error) {
      
      console.log(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          setAlerta({
            msg: error?.response?.data.msg,
            error: true,
          });
        }
      } else {
        console.error('Generic Error:', error);
      }
    } finally {
      setCargando(false);
      await delay(10000);
      setAlerta({});
    }
  };

  const handleEliminarColaborador = async (id:string) => {
    const config = obtenerConfig();
    if (!config) return;
    try {
      const { data } = await clienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id },
        config
      );
      const proyectoActualizado = { ...proyecto };

      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState: Usuario) => colaboradorState._id !== id
        );

      setProyecto(proyectoActualizado);
      setAlerta({
        msg: data.msg,
        error: false,
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          setAlerta({
            msg: error?.response?.data.msg,
            error: true,
          });
        }
      } else {
        console.error('Generic Error:', error);
      }
    } finally {
      setModalEliminarColaborador(false);
      await delay(10000);
      setAlerta({});
    }
  };
  return (
    <ProyetoContext.Provider
      value={{
        proyectos,
        alerta,
        proyecto,
        cargando,
        modalFormularioTarea,
        tarea,
        modalEliminarTarea,
        colaborador,
        modalEliminarColaborador,
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        eliminarProyecto,
        setProyectos,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        handleEliminarTarea,
        handleModalEliminarTarea,
        submitColaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        handleEliminarColaborador,
        setColaborador,
      }}
    >
      {children}
    </ProyetoContext.Provider>
  );
};

export { ProyectoProvider };

export default ProyetoContext;

 
