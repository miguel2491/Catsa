import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import Cookies from 'universal-cookie'
import axios from 'axios'

import {
  CAvatar,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
} from '@coreui/icons'

import TabulatorP from '../base/tabs/TabulatorP'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

async function GetCotizaciones(){
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
      await axios.get(baseUrl+'Ventas/GetCotizaciones',confi_ax)
      .then(response=>{
        //console.log(response.data);
        //cookies.set('menus', JSON.stringify(response), {path: '/'});
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
const LCotizacion = () => {    
  const [selectedValue , setPlantaC] = useState('');
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };

  useEffect(()=>{    
    console.log(plantasSel, vFechaI, vFcaF);
  
  });
  const mCambio = (event) => {
    setPlantas(event.target.value);
    GetCotizaciones();
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  
  function GetCotizaciones()
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
      //--------------------------------------------------
      axios.get(baseUrl+'Comercial/GetCotizaciones/'+auxFcaI+","+auxFcaF+","+cookies.get('Usuario')+","+plantasSel,confi_ax)
      .then(response=>{
        setPosts(response)
        return response.data;
      }).then(response=>{
        var obj = JSON.stringify(response);
        if(obj.length>0){
          obj = JSON.parse(obj);
          setPosts(response)
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
    } catch(error){
      console.log(error);
    }
  }
  return (
    <>
    <CContainer fluid>
      <CRow>
        <CCol sm="auto">
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol sm="auto">
          <FechaI 
            vFechaI={vFechaI} 
            cFechaI={cFechaI} 
          /></CCol>
        <CCol sm="auto">
          <FechaF 
            vFcaF={vFcaF} 
            mFcaF={mFcaF}
          />
        </CCol>
      </CRow>
    </CContainer>
    <TabulatorP titulo={'Cotizaciones'} posts={posts} />
    </>
  )
}

export default LCotizacion
