import { useState, createRef } from "react";
import firebase from "../config/firebase";
import ReCAPTCHA from "react-google-recaptcha";
import useAlerta from "../hooks/useAlerta";

const FormConsulta = () => {
  const [resultado, setResultado] = useState({ data: null, consultado: false });
  const [loadingLocal, setLoadingLocal] = useState(null);
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
    setResultado({ data: null, consultado: false });

    const recaptchaValue = recaptchaRef.current.getValue();
    //console.log(recaptchaValue);

    if (recaptchaValue) {
      if (cuil.trim().length !== 11) {
        setAlerta({
          msg: "Debe ingresar su Número de CUIL sin guiones",
          class: "danger",
        });
      } else {
        consultar(cuil);
      }
    } else {
      setAlerta({
        msg: "Debe validar reCAPTCHA",
        class: "danger",
      });
      //return;
    }
  };

  const consultar = async (micuil) => {
    setResultado({ data: null, consultado: false });

    setLoadingLocal(true);

    const db = firebase.database();
    const ref = db.ref("/");

    //console.log(cuil);
    ref
      .orderByChild("CUIL")
      .equalTo(micuil)
      .once("value")
      .then((snapshot) => {

        if (snapshot.val()) {
          setAlerta(null);
          console.log("salida", snapshot.val());
          const data = snapshot.val();
          setResultado({ data, consultado: true });
        } else {
          console.log("no hay datos");
          setAlerta({
            msg: "No se encontraron resultados.",
            class: "danger",
          });
        }
      });

    setLoadingLocal(false);
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
      {resultado.data ? <table
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
          <td>
            {!resultado.data.BEN_COD_SUC ? (
              "Sucursal No Asignada"
            ) : (
              <>
                {resultado.data.BEN_COD_SUC} - {resultado.data.BEN_SUCURSAL}
              </>
            )}
          </td>
        </tr>
      </tbody>
    </table> : null}
    </div>
  );
};

export default FormConsulta;
