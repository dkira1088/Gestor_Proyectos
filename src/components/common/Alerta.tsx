import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alerta } from "../../types/CommonTypes";

interface Props {
  alerta: Alerta
}

const Alerta = ({ alerta }: Props) => {
  const { msg, error } = alerta;

  const alertOptions = {
    autoClose: 1000,
  };
  useEffect(() => {
    const notify = () => {
      if (error) {
        toast.error(msg, alertOptions);
      } else {
        toast.success(msg, alertOptions);
      }
    };
    notify();
  }, [alerta]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Alerta;
