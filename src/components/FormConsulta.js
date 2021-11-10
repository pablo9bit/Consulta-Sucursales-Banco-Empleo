import { useState, createRef } from "react";
import firebase from "../config/firebase";
import ReCAPTCHA from "react-google-recaptcha";

import useAlerta from "../hooks/useAlerta";

const FormConsulta = () => {
  const [resultado, setResultado] = useState({ data: null, consultado: false });
  const [setAlerta, MostrarAlerta] = useAlerta(null);
  const [DatosForm, LeerForm] = useState({ cuil: "" });
  const { cuil } = DatosForm;

  const recaptchaRef = createRef();

  const onChange = (e) => {
    LeerForm({
      ...DatosForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlerta(null);

    const recaptchaValue = recaptchaRef.current.getValue();

    if (recaptchaValue) {
      if (cuil.trim().length !== 11) {
        setAlerta({
          msg: "Debe ingresar su Número de CUIL sin guiones",
          class: "danger",
        });
      } else {
        buscar(cuil);
      }
    } else {
      setAlerta({
        msg: "Debe validar reCAPTCHA",
        class: "danger",
      });
    }
  };

  const buscar = async (micuil) => {
    setResultado({ data: null, consultado: false });
    const db = firebase.database();
    const ref = db.ref("/");

    ref
      .orderByChild("CUIL")
      .equalTo(micuil)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          const key = Object.keys(snapshot.val())[0];
          setResultado({ data: data[key], consultado: true });
        } else {
          setAlerta({
            msg: "No se encontraron resultados.",
            class: "danger",
          });
        }
      });
  };

  const sucursalBcaria = () => {
    if (!resultado.data.BEN_COD_SUC && !resultado.data.APO_COD_SUC) {
      return "Sucursal No Asignada";
    }
    if (resultado.data.BEN_COD_SUC && !resultado.data.APO_COD_SUC) {
      return resultado.data.BEN_COD_SUC + " - " + resultado.data.BEN_SUCURSAL;
    }
    if (!resultado.data.BEN_COD_SUC && resultado.data.APO_COD_SUC) {
      return resultado.data.APO_COD_SUC + " - " + resultado.data.APO_SUCURSAL;
    }
  };

  const fechaInicio = () => {
    let date = new Date(resultado.data.FECHA_INICIO);
    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString("es-AR");
  };

  return (
    <div>
      <img src="header_banco_gente.png" width="100%" alt="bancodelagente" />
      <br></br>
      <div className="text-center p-1">
        <b>CONSULTA DE SUCURSAL BANCARIA ASIGNADA</b>
      </div>
      <form onSubmit={onSubmit} style={{ margin: "30px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            style={{ width: "400px" }}
            type="text"
            name="cuil"
            className="form-control"
            id="cuil"
            placeholder="Ingrese su CUIL (Sin Guiones)"
            onChange={onChange}
            value={cuil}
          />
        </div>
        <br></br>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReCAPTCHA
            //https://bancodelagente-cba-gov-ar.web.app/
            //sitekey="6LfsQhQcAAAAACwwTgk47g1TVusF8mhGb4eRC_lO"
            sitekey="6LeH_HUbAAAAAApK164OIBLZOX0uOaZWiXYRZjw_"
            ref={recaptchaRef}
            onChange={onChange}
          />
        </div>
        <br></br>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="btn btn-primary" type="submit">
            consultar
          </button>
        </div>
      </form>
      <MostrarAlerta />
      {resultado.data ? (
        <table
          className="table table-striped "
          style={{ margin: "auto", width: "600px" }}
        >
          <tbody>
            <tr>
              <th scope="row">CUIT</th>
              <td>{resultado.data.CUIL}</td>
            </tr>
            <tr>
              <th scope="row">Nombre</th>
              <td>{resultado.data.NOMBRE}</td>
            </tr>
            <tr>
              <th scope="row">Apellido</th>
              <td>{resultado.data.APELLIDO}</td>
            </tr>
            <tr>
              <th scope="row">Sucursal Bancaria</th>
              <td>{sucursalBcaria()}</td>
            </tr>
            {resultado.data.CUIT !== "11-11111111-1" ? (
              <>
                <tr>
                  <th scope="row">Empresa Donde Realizar la Práctica</th>
                  <td>
                    CUIT: {resultado.data.CUIT} - {resultado.data.N_EMPRESA}
                  </td>
                </tr>

                {resultado.data.ID_FICHA ? (
                  <tr>
                    <th scope="row">Fecha Inicio Práctica</th>
                    <td>{fechaInicio()}</td>
                  </tr>
                ) : null}
              </>
            ) : null}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default FormConsulta;
