import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
const Alerta = ({ alerta }) => {
  // eslint-disable-next-line react/prop-types
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
