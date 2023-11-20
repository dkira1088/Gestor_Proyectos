import clienteAxios from "../config/clienteAxios";
import { useEffect, useState } from "react";
import { ErrorResponse, Link, useParams } from "react-router-dom";
import Alerta from "../components/common/Alerta";
import axios, { AxiosError } from "axios";
import { Alerta as AlertType } from "../types/CommonTypes";

const ConfirmarCuenta = () => {
  const { id } = useParams();
  const [alerta, setAlerta] = useState<AlertType>({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios(url);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
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
      }
    };
    confirmarCuenta();
  }, []);

  const { msg } = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma tu cuenta y comienza a crear tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}
        {cuentaConfirmada && (
          <Link
            to="/"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
            Inicia sesión
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmarCuenta;
