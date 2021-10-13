import  {useState } from "react";

const useAlerta = () => {
  const [objMensaje, setAlerta] = useState(null);
  
  const MostrarAlerta = () => {
  
    
    return (
      <>
        {objMensaje ? (
          <div className={`alert alert-${objMensaje.type==="error" ? "danger" : "success"} m-5`} role="alert">
            <b className="font-bold">Atención! </b><br></br>
            <span>{objMensaje.msg}</span>
          </div>
        ) : null}
      </>
    );
  };

  return [setAlerta, MostrarAlerta];
};

export default useAlerta;
