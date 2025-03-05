import React,{useEffect, useState, useRef} from 'react';
import Swal from "sweetalert2";
import Cookies from 'universal-cookie';
import {
  CFormSelect,
} from '@coreui/react'
import { getPlantas } from '../../../Utilidades/Funciones';
const cookies = new Cookies();
const baseUrl="https://apicatsa2.catsaconcretos.mx:2533/api/";
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
            getPlantas_();
        }
    },[]);
    const getPlantas_ = async()=>
    {
      try{
        const ocList = await getPlantas();
        if(ocList)
        {
            setaplantas_(ocList)
        }
        Swal.close();  // Cerramos el loading
      }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }
    return (
      <div>
        <label>Seleccione Planta</label>
        <div className='mt-2'>
          <CFormSelect aria-label="Selecciona" id="cmbPlanta" value={plantasSel} onChange={mCambio}>
            <option value="" >Selecciona...</option>
            {plantas_.map((planta, index) =>(
                <option value={planta.IdPlanta} key={index}>{planta.Planta}</option>
            ))}
          </CFormSelect>
        </div>
      </div>
    );
  };
  
  export default Plantas;

