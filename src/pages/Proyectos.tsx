import { useEffect } from "react";
import PreviewProyecto from "../components/PreviewProyecto";
import useProyectos from "../hooks/useProyectos";
import clienteAxios from "../config/clienteAxios";

const Proyectos = () => {
  const { proyectos, setProyectos } = useProyectos();

  useEffect(() => {
    const obtenerProyectos = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios("/proyectos", config);
      setProyectos(data.proyectos);
    };
    obtenerProyectos();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      <div className="bg-white shadow mt-10 rounded-lg p-5">
        {proyectos.length ? (
          proyectos.map((proyecto) => (
            <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
          ))
        ) : (
          <p className="mt-5 text-center text-gray-600 uppercase">
            No hay proyectos
          </p>
        )}
      </div>
    </>
  );
};

export default Proyectos;
