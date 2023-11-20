import React, { Fragment, useState } from "react";
import { ErrorResponse, Link } from "react-router-dom";
import Alerta from "../components/common/Alerta";
import clienteAxios from "../config/clienteAxios";
import axios, { AxiosError } from "axios";
import { Alerta as AlertType } from "../types/CommonTypes";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState<AlertType>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "" || email.length < 6) {
      setAlerta({ msg: "El email es obligatorio", error: true });
      return;
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {
        email,
      });

      setAlerta({ msg: data.msg, error: false });
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

  const { msg } = alerta;
  return (
    <Fragment>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera tu acceso y no pierdas tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}
      <form
        className="my-10 bg-white shadow-sm rounded-lg p-10 py-5"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Enviar instrucciones"
          className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
        <Link
          to="/registrar"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿No tienes una cuenta? Registrate
        </Link>
      </nav>
    </Fragment>
  );
};

export default OlvidePassword;
