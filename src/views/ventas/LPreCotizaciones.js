import React,{useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";

import {
  CContainer,
  CRow,
  CCol,
  CModal
} from '@coreui/react'

import TabulatorG from '../base/tabs/TabulatorP'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'

const cookies = new Cookies();
const baseUrl2="https://apicatsa2.catsaconcretos.mx:2533/api/";
const baseUrl="http://localhost:2548/api/";

const LPreCotizacion = () => {
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [posts, setPosts] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  useEffect(()=>{    
    console.log(vFechaI, vFcaF);
    if(vFechaI===null)
      {
        //Swal.fire("INFO!", "Buen Trabajo!", "danger");
      }else{
        if(plantasSel.length >0 && vFechaI.length > 0 && vFcaF.length > 0 && posts.length == 0)
          {
            console.log(plantasSel, vFechaI, vFcaF, posts);
            GetPreCotizaciones();
          }
      }
  });
  const mCambio = (event) => {
    setPlantas(event.target.value);
    
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  async function GetPreCotizaciones()
  {
    if(vFechaI != "" && vFcaF != "")
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
        const fcaIni = vFechaI.split('/');
        let auxFcaI = fcaIni[2]+"-"+fcaIni[0]+"-"+fcaIni[1];
        const fcaFin = vFcaF.split('/');
        let auxFcaF = fcaFin[2]+"-"+fcaFin[0]+"-"+fcaFin[1];
        if(plantasSel.length > 0){
        //--------------------------------------------------
          axios.get(baseUrl+'Comercial/GetPreCotizaciones/'+auxFcaI+","+auxFcaF+","+cookies.get('Usuario')+","+plantasSel,confi_ax)
          .then(response=>{
            setPosts(response)
            return response.data;
          }).then(response=>{
            var obj = JSON.stringify(response);
            if(obj.length>0){
              obj = JSON.parse(obj);
              const filteredData = obj.filter(item =>
                item.IdPlanta.includes(plantasSel)
              );
              setPosts(filteredData)
            }else{    
              //setErrorResponse(json.body.error);
              addToast(exampleToast)
            }
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
        }
        //=============================================================================================================================  
      } catch(error){
        console.log(error);
      }
    }
    
  }
  return (
    <>
      <CModal titulo={"MENSAJE"} />
      <CContainer fluid>
        <h1>PreCotizaciones</h1>
        <CRow>
          <CCol sm="auto">
            <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
            />
          </CCol>
          <CCol sm="auto">
            <FechaF 
              vFcaF={vFcaF} 
              mFcaF={mFcaF}
            />
          </CCol>
          <CCol sm="auto">
            <Plantas  
              mCambio={mCambio}
              plantasSel={plantasSel}
            />
          </CCol>
        </CRow>
      </CContainer>
      <TabulatorG titulo={'PreCotizaciones'} posts={posts} />
    </>
  )
}

export default LPreCotizacion
