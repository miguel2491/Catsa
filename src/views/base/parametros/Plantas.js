import React,{useEffect, useState, useRef} from 'react';

import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
const ap = [];
cookies.set('plantas', [], {path: '/'});
const Plantas = ({plantasSel, mCambio}) => {
    const [plantas_, setaplantas_] = useState([]);
    
    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (event) => {
        //setSelectedOption(event.target.value);
    };
    useEffect(()=>{
        if(cookies.get('plantas').length > 0)
        {
            var obj = cookies.get('plantas');
            obj = obj;
            if(ap.length <= 0)
            {
                for(var x = 0; x < obj.length; x++)
                {
                    ap.push({
                        "ID":x,
                        "IdPlanta":obj[x].IdPlanta,
                        "Planta":obj[x].Planta
                    });
                }
            }
            setaplantas_(ap);
        }else{
            getPlantas();
        }
    });
    function getPlantas()
    {
      try{
          let confi_ax = 
            {
              headers:
              {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
              }
            }
            //=======================================================
            axios.get(baseUrl+'Administracion/GetPlantas/'+cookies.get('Usuario'),confi_ax)
            .then(response=>{
              cookies.set('plantas', JSON.stringify(response.data), {path: '/'});
              //setaplantas_(JSON.stringify(response.data));
              var obj = response.data;
              for(var x = 0; x < obj.length; x++)
              {
                  ap.push({
                      "ID":x,
                      "IdPlanta":obj[x].IdPlanta,
                      "Planta":obj[x].Planta
                  });
              }
              setaplantas_(ap);
              return response.data;
            }).then(response=>{
              //console.log("=>");
            })
            .catch(err=>{
              if (err.response) {
                // El servidor respondió con un código de estado fuera del rango de 2xx
                console.error('Error de Respuesta:', err.response.data);
                //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
              } else if (err.request) {
                // La solicitud fue realizada pero no se recibió respuesta
                //setError('Error: No se recibió respuesta del servidor.');
              } else {
                // Algo sucedió al configurar la solicitud
                console.error('Error:', err.message);
                //setError(`Error: ${err.message}`);
              }
            })
            //=======================================================
      }catch(error){
          console.log(error);
      }
    }
    return (
      <div>
        <label>Seleccione Planta</label>
        <div>
        <select id="cmbPlanta" value={plantasSel} onChange={mCambio}>
            <option value="" >Selecciona...</option>
            {plantas_.map(planta =>(
                <option value={planta.IdPlanta} key={planta.ID}>{planta.Planta}</option>
            ))}
            </select>
            {/* {selectedOption && (
                <p>Has seleccionado: {selectedOption}</p>
            )} */}
        </div> {/* Contenedor para Tabulator */}
      </div>
    );
  };
  
  export default Plantas;

