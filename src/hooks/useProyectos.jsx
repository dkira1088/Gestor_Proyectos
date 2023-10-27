import { useContext } from "react";
import ProyetoContext from "../context/ProyectoContext";

const useProyectos = () => useContext(ProyetoContext);

export default useProyectos;
