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
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const LPedidos = () => {
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  useEffect(()=>{    
    if(vFechaI!=null)
      {
        //Swal.fire("INFO!", "Buen Trabajo!", "danger");
        if(plantasSel.length >0 && vFechaI.length > 0 && vFcaF.length > 0 && posts.length == 0)
            {
              GetPedidos();
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
  const sendGetPedidos = () =>{
    console.log(plantasSel, vFechaI, vFcaF)
    GetPedidos(plantasSel, vFechaI, vFcaF)
}
  async function GetPedidos(planta, fechaI, fechaF)
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
          axios.get(baseUrl2+'Logistica/GetPedidos/'+plantasSel+','+auxFcaI+","+auxFcaF+","+cookies.get('Usuario'),confi_ax)
          .then(response=>{
            setPosts(response)
            return response.data;
          }).then(response=>{
            var obj = JSON.stringify(response);
            if(obj.length>0){
              obj = JSON.parse(obj);
              console.log(obj)
              setPosts(obj)
            }else{    
              //setErrorResponse(json.body.error);
              //Swal.fire("ERROR", json.body.error, "danger");
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
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
      <CContainer fluid>
        <h1>Pedidos</h1>
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
          <CCol sm="auto" className='mt-3'>
            <CButton color='primary' onClick={sendGetPedidos}>
                <CIcon icon={cilSearch} className="me-2" />
                Realizar
            </CButton>
            </CCol>
        </CRow>
      </CContainer>
      <TabulatorG titulo={'Pedidos'} posts={posts} />
    </>
  )
}

export default LPedidos
