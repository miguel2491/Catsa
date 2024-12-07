import React,{useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";

import {
  CContainer,
  CRow,
  CCol,
  CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
  CButton
} from '@coreui/react'

import TabulatorG from '../base/tabs/TabulatorP'
import FechaF from '../base/parametros/FechaFinal'
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";

const CProductos = () => {
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [visible, setVisible] = useState(false);// Modal Cargando
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
    setLoading(true);
    setVisible(true);
    setPercentage(0);
    GetRCProductos(vFcaF);

}
  async function GetRCProductos(fechaF)
  {
    const interval = setInterval(() => {
      setPercentage(prev => {
      if (prev < 90) return prev + 10;
      return prev;
      });
    }, 5000);
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
          axios.get(baseUrl+'Reportes/GetCostoProducto/'+auxFcaF,confi_ax)
          .then(response=>{
            setPosts(response.data)
            console.log(response.data);
            setPercentage(100);
            clearInterval(interval); // Limpiar el intervalo
            setLoading(false);
            setVisible(false);
            return response.data;
          })
          .catch(err=>{
            setLoading(false);
            setVisible(false);
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
        setLoading(false);
        setVisible(false);
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
      <CModal
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
      >
          <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">Cargando...</CModalTitle>
          </CModalHeader>
          <CModalBody>
              {loading && (
                  <CRow className="mt-3">
                      <ProgressBar completed={percentage} />
                      <p>Cargando: {percentage}%</p>
                  </CRow>
              )}
          </CModalBody>
          <CModalFooter />
      </CModal>
    </>
  )
}

export default CProductos
