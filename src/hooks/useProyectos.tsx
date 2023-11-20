import { useContext } from "react";
import ProyetoContext from "../context/ProyectoContext";

const useProyectos = () => {
    const context = useContext(ProyetoContext);
    
    if(context === undefined){
        throw new Error("Proyecto context debe ser inicializado");
    }
    
    return context;
} 

export default useProyectos;
