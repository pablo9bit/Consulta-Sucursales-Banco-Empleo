import { useState, createRef, useEffect } from "react";
import firebase from "../config/firebase";
import ReCAPTCHA from "react-google-recaptcha";
import useAlerta from "../hooks/useAlerta";

const FormConsulta = () => {
  const [resultado, setResultado] = useState({ data: null, consultado: false });
  const [setAlerta, MostrarAlerta] = useAlerta(null);
  const [loadingLocal, setLoadingLocal] = useState(null);

  const [DatosForm, LeerForm] = useState({ cuil: "" });
  const { cuil } = DatosForm;

  const recaptchaRef = createRef();

  useEffect(() => {
    const alertar = () => {
      if (resultado.data === null && resultado.consultado && !loadingLocal ) {
        setAlerta({
          msg: "No se encontraron resultados.",
          class: "danger",
        });
      }
      if(resultado.data){
        setAlerta(null)
      }
    };

    alertar();
  }, [resultado, loadingLocal]);

  const onChange = (e) => {
    LeerForm({
      ...DatosForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlerta(null);

    const recaptchaValue =recaptchaRef.current.getValue();
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
    setResultado({ data: null, consultado: true });

    setLoadingLocal(true);

    const db = firebase.database();
    const ref = db.ref("/");

    //console.log(cuil);
    ref
      .orderByChild("CUIL")
      .equalTo(micuil)
      .on(
        "child_added",
        (snapshot) => {
          //console.log("salida", snapshot.val());

          let data = null;
          if (snapshot.val()) {
            data = snapshot.val();
          }

          setResultado({ data, consultado: true });
          if (data === null  ) {
            setAlerta({
              msg: "No se encontraron resultados.",
              class: "danger",
            });
          }else{
            setAlerta(null);
          }
          setLoadingLocal(false);
        }
      );
      setLoadingLocal(false);
  };

  const Mensaje = () => {
    let mje = "";
    if (resultado.data.APTO_CARGA === "True") {
      mje = "Su solicitud de crédito número de Sticker " + resultado.data.Sticker + " en base a un análisis preliminar, la documentación se encuentra correcta, continúa en proceso de evaluación. Se le notificará vía CIDI cualquier resolución.. Se le notificará via CIDI cualquier resolución"

    } else {

      if (resultado.data.EVALUADO === "True") {
        mje = "Su solicitud de crédito número de Sticker " + resultado.data.Sticker + " posee las siguientes observaciones: " + resultado.data.PARA_NOTIFICAR + " Si desea puede completar la documentación en <a href='https://tramitesbancodelagente.cba.gov.ar/formulario/ingreso-documentacion-faltante'>https://tramitesbancodelagente.cba.gov.ar/formulario/ingreso-documentacion-faltante</a";
      } else {
        mje = "Su solicitud de crédito número de Sticker " + resultado.data.Sticker + " Se encuentra en proceso de control y verificación de la documentación presentada";
      }
      //console.log(mje);
    }

    return mje;
  }
  return (
    <div>
      <img src="header_banco_gente.png" width="100%" alt="bancodelagente" />
      <br></br>
      <div className="text-center p-1">
        <b>CONSULTA DE ESTADO SOLICITUD CREDITO LIBRE DISPONIBILIDAD</b>
      </div>
      <form onSubmit={onSubmit} style={{ margin: "30px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input style={{ width: "400px" }}

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
          <button className="btn btn-primary" type="submit">
            consultar
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {loadingLocal ? <div className="m-2"><b>Buscando...</b></div> : ""}
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

      </form>
      <MostrarAlerta />

      {resultado.data ? (
        <table className="table table-striped row p-3">
          <tbody>
            <tr>
              <th scope="row">CUIT</th>
              <td>{resultado.data.CUIL}</td>
            </tr>
            <tr>
              <th scope="row">Nombre</th>
              <td>{resultado.data.Nombres}</td>
            </tr>
            <tr>
              <th scope="row">Apellido</th>
              <td>{resultado.data.Apellido}</td>
            </tr>
            <tr>
              <th scope="row">Mensaje</th>
              <td>      
                <div contentEditable='true' dangerouslySetInnerHTML={{ __html: Mensaje() }}></div>
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default FormConsulta;
