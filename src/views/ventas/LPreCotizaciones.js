import React,{useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import {
  CContainer,
  CRow,
  CCol,
  CModal
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
} from '@coreui/icons'

import TabulatorG from '../base/tabs/TabulatorP'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

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
  const mCambio = (event) => {
    setPlantas(event.target.value);
    
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  
  return (
    <>
      <CModal titulo={"MENSAJE"} />
      <CContainer fluid>
        <h1>PreCotizaciones</h1>
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
            />
          </CCol>
          <CCol sm="auto">
            <FechaF 
              vFcaF={vFcaF} 
              mFcaF={mFcaF}
            />
          </CCol>
        </CRow>
      </CContainer>
      <TabulatorG titulo={'PreCotizaciones'} posts={posts} />
    </>
  )
}

export default LPreCotizacion
