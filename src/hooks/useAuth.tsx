import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if(context === undefined) {
    throw new Error("Auth Context debe se inicializado");
  }

  return context;
};

export default useAuth;
