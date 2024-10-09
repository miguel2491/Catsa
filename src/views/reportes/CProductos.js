import React,{useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";

import {
  CContainer,
  CRow,
  CCol,
  CButton
} from '@coreui/react'

import TabulatorG from '../base/tabs/TabulatorP'
import FechaF from '../base/parametros/FechaFinal'
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const CProductos = () => {
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  useEffect(()=>{    
    if(vFcaF!=null)
      {
        //Swal.fire("INFO!", "Buen Trabajo!", "danger");
        if(vFcaF.length > 0 && posts.length == 0)
            {
              GetRCProductos();
            }
        }
  });
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  const sendGetRCP = () =>{
    GetRCProductos(vFcaF)
}
  async function GetRCProductos(fechaF)
  {
    if(vFcaF != "")
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
        const fcaFin = vFcaF.split('/');
        let auxFcaF = fcaFin[2]+"-"+fcaFin[0]+"-"+fcaFin[1];
        //--------------------------------------------------
          axios.get(baseUrl2+'Reportes/GetCostoProducto/'+auxFcaF,confi_ax)
          .then(response=>{
            setPosts(response.data)
            console.log(response.data);
            return response.data;
          })
          .catch(err=>{
            if (err.response) {
              // El servidor respondió con un código de estado fuera del rango de 2xx
              console.error('Error de Respuesta:', err.response.data);
              addToast(exampleToast)
              //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
            } else if (err.request) {
              // La solicitud fue realizada pero no se recibió respuesta
              console.error('Error de Solicitud:', err.request);
              //setError('Error: No se recibió respuesta del servidor.');
            } else {
              // Algo sucedió al configurar la solicitud
              console.error('Error:', err.message);
              //setError(`Error: ${err.message}`);
            }
            //cookies.remove('token', {path: '/'});
          })
        
        //=============================================================================================================================  
      } catch(error){
        console.log(error);
      }
    }
    
  }
  return (
    <>
      <CContainer fluid>
        <h1>Reporte Costos Productos</h1>
        <CRow>
          <CCol sm="auto">
            <FechaF 
              vFcaF={vFcaF} 
              mFcaF={mFcaF}
            />
          </CCol>
          <CCol sm="auto" className='mt-3'>
            <CButton color='primary' onClick={sendGetRCP}>
                <CIcon icon={cilSearch} className="me-2" />
                Realizar
            </CButton>
            </CCol>
        </CRow>
      </CContainer>
      <TabulatorG titulo={'RCP'} posts={posts} />
    </>
  )
}

export default CProductos
