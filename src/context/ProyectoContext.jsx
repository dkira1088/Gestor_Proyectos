import { createContext, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import delay from "../helpers/delayHelper";
const ProyetoContext = createContext();

// eslint-disable-next-line react/prop-types
const ProyectoProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
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

  const mostrarAlerta = async (alerta) => {
    setAlerta(alerta);
    await delay(3000);
    setAlerta({});
  };

  const editarProyecto = async (proyecto) => {
    try {
      const config = obtenerConfig();
      if (!config) return;

      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
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

  const crearProyecto = async (proyecto) => {
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

  const eliminarProyecto = async (id) => {
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
  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await crearProyecto(proyecto);
    }
  };

  const obtenerProyecto = async (id) => {
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
    setTarea("");
  };

  const submitTarea = async (tarea) => {
    try {
      if (tarea.id) {
        await editarTarea(tarea);
      } else {
        await crearTarea(tarea);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const crearTarea = async (tarea) => {
    const config = obtenerConfig();
    if (!config) return;
    try {
      const { data } = await clienteAxios.post("/tareas", tarea, config);

      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.tareas = [...proyecto.tareas, data];
      setProyecto(proyectoActualizado);
      setAlerta({});
      setModalFormularioTarea(false);
    } catch (error) {
      console.log(error);
    }
  };

  const editarTarea = async (tarea) => {
    const config = obtenerConfig();
    if (!config) return;
    try {
      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );

      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.tareas = proyectoActualizado.tareas.map(
        (tareaState) => {
          return tareaState._id === data._id ? data : tareaState;
        }
      );
      setProyecto(proyectoActualizado);
      setAlerta({});
      setModalFormularioTarea(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
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
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        eliminarProyecto,
        setProyectos,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
      }}
    >
      {children}
    </ProyetoContext.Provider>
  );
};

export { ProyectoProvider };

export default ProyetoContext;
