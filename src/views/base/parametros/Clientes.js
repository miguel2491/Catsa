import React,{useEffect, useState, useRef} from 'react';
import Swal from "sweetalert2";
import Cookies from 'universal-cookie';
import {
  CFormSelect,
} from '@coreui/react'
import { getClientes } from '../../../Utilidades/Funciones';
const cookies = new Cookies();
const ap = [];
cookies.set('clientes', [], {path: '/'});
const Clientes = ({clienteSel, mCliente}) => {
    const [clientes_, setaclientes_] = useState([]);
    
    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (event) => {
        //setSelectedOption(event.target.value);
    };
    useEffect(()=>{
        if(cookies.get('clientes').length > 0)
        {
            var obj = cookies.get('clientes');
            obj = obj;
            if(ap.length <= 0)
            {
                for(var x = 0; x < obj.length; x++)
                {
                    ap.push({
                        "ID":x,
                        "Planta":obj[x].IdPlanta,
                        "Description":obj[x].Planta
                    });
                }
            }
            setaclientes_(ap);
        }else{
            getClientes_();
        }
    },[]);
    
    const getClientes_ = async()=>
    {
      try{
        const ocList = await getClientes();
        if(ocList)
        {
            setaclientes_(ocList)
        }
        Swal.close();  // Cerramos el loading
      }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }

    return (
      <div>
        <label>Seleccione Cliente</label>
        <div className='mt-2'>
          <CFormSelect aria-label="Selecciona" id="cmbCliente" value={clienteSel} onChange={mCliente}>
            <option value="" >Selecciona...</option>
            {clientes_.map((cliente, index) =>(
                <option value={cliente.Description} key={index}>{cliente.Description}</option>
            ))}
          </CFormSelect>
        </div>
      </div>
    );
  };
  
  export default Clientes;

