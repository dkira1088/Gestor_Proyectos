import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import Spinner from "../components/common/spinner";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import Tarea from "../components/Tarea";
import { ModalEliminarTarea } from "../components/ModalEliminarTarea";
import Alerta from "../components/common/Alerta";
import Colaborador from "../components/Colaborador";
import { ModalEliminarColaborador } from "../components/ModalEliminarColaborador";

const Proyecto = () => {
  const { id } = useParams();
  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta } =
    useProyectos();
  const { nombre, tareas, colaboradores } = proyecto;
  console.log(proyecto);
  useEffect(() => {
    obtenerProyecto(id);
  }, []);
  return cargando ? (
    <Spinner />
  ) : (
    <>
      {alerta.msg ? <Alerta alerta={alerta} /> : ""}
      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{nombre}</h1>
        <div className="flex items-center gap-2 text-gray-400 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
          <Link to={`/proyectos/editar/${id}`} className="uppercase font-bold">
            Editar
          </Link>
        </div>
      </div>
      <button
        className="text-sm px-5 py-3 mt-5 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center flex flex-row items-center gap-2 "
        onClick={handleModalTarea}
      >
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
            clipRule="evenodd"
          />
        </svg>
        Nueva Tarea
      </button>
      <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>
      <div className="bg-white shadow mt-10 rounded-lg">
        {tareas?.length > 0 ? (
          tareas.map((tarea) => <Tarea key={tarea._id} tarea={tarea} />)
        ) : (
          <p className="px-2 py-5">No hay tareas</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-10">
        <p className="font-bold text-xl mt-10">Colaboradores</p>
        <Link
          to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
          className="text-gray-400 hover:text-black uppercase font-bold"
        >
          Añadir
        </Link>
      </div>
      <div className="bg-white shadow mt-10 rounded-lg">
        {colaboradores?.length > 0 ? (
          colaboradores.map((colaborador) => (
            <Colaborador key={colaborador._id} colaborador={colaborador} />
          ))
        ) : (
          <p className="px-2 py-5">No hay colaboradores</p>
        )}
      </div>
    </>
  );
};

export default Proyecto;
