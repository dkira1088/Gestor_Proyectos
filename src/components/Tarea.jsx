import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";

// eslint-disable-next-line react/prop-types
const Tarea = ({ tarea }) => {
  // eslint-disable-next-line react/prop-types
  const { descripcion, nombre, prioridad, fechaEntrega, estado } = tarea;
  const { handleModalEditarTarea, handleModalEliminarTarea } = useProyectos();

  return (
    <div className="border-b p-5 flex justify-normal items-center gap-1">
      <div className="grow">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm uppercase text-gray-500">{descripcion}</p>
        <p className="mb-1 text-xl">{prioridad}</p>
        <p className="mb-1 text-gray-500">{formatearFecha(fechaEntrega)}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          className="bg-indigo-600 px-4 py-3 text-white uppercase text-sm rounded-lg"
          onClick={() => handleModalEditarTarea(tarea)}
        >
          Editar
        </button>
        {estado ? (
          <button className="bg-sky-600 px-4 py-3 text-white uppercase text-sm rounded-lg">
            Completa
          </button>
        ) : (
          <button className="bg-gray-600 px-4 py-3 text-white uppercase text-sm rounded-lg">
            Incompleta
          </button>
        )}
        <button
          className="bg-red-600 px-4 py-3 text-white uppercase text-sm rounded-lg"
          onClick={() => handleModalEliminarTarea(tarea)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Tarea;
