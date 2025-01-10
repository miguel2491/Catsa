import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";

import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'
import Plantas from '../base/parametros/Plantas'
import Periodo from '../base/parametros/Periodo'
import Mes from '../base/parametros/Mes'
import TabulatorG from '../base/tabs/TabulatorP'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const exampleToast = (
    <CToast title="CoreUI for React.js">
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">CoreUI for React.js</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>Hello, world! This is a toast message.</CToastBody>
    </CToast>
  )

const PreCierre = () => {
    const [toast, addToast] = useState(0)
    const toaster = useRef()
    const [plantasSel , setPlantas] = useState('');
    const [periodoSel , setPeriodo] = useState('');
    const [mesSel , setMes] = useState('');
    const [posts, setPosts] = useState([]);
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const mPeriodo = (event) => {
        setPeriodo(event.target.value);
    };
    const mMes = (event) => {
        setMes(event.target.value);
    };

    const sendPC = () =>{
        setPreCierre(plantasSel, periodoSel, mesSel)
    }

    async function setPreCierre(planta, periodo, mes)
    {
        if(planta === "" || periodo === "" || mes === "")
        {
            console.error("Debes llenar todos los parametros", planta, periodo, mes)
        }
        else
        {
            try
            {
                const postData = 
                {
                    planta:planta,
                    periodo:periodo,
                    mes:mes
                }
                let confi_ax = 
                    {
                    headers:
                    {
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer "+cookies.get('token'),
                    }
                }
                //------------------------------------------------------------------------------------------------------------------------------------------------------
                await axios.get(baseUrl+'Operaciones/SetPreCierreMensual/'+planta+','+mes+','+periodo, confi_ax)
                .then(response=>{
                    // console.log(response.data);
                    // var obj = response.data;
                    // getInventario(obj);
                    //setPosts(response)
                    Swal.fire("CORRECTO", "Se Agrego Correctamente", "success");
                    return response.data;
                }).then(response=>{
                    console.log(response);
                    var obj = JSON.stringify(response);
                    if(obj.length>0){
                        obj = JSON.parse(obj);
                        setPosts(obj)    
                    }else{
                        //setErrorResponse(json.body.error);
                        //addToast(exampleToast)
                    }
                })
                .catch(err=>{
                    if (err.response) {
                        // El servidor respondió con un código de estado fuera del rango de 2xx
                        console.error('Error de Respuesta:', err.response.data);
                        //addToast(exampleToast)
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
                })    
                //------------------------------------------------------------------------------------------------------------------------------------------------------
            }
            catch(error)
            {
                console.error(error);
            }
        }
    }

    
return (
    <>
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <CContainer fluid>
            <h1>PreCierre</h1>
            <CForm>
              <CRow>
                <CCol sm="auto">
                  <Plantas  
                    mCambio={mCambio}
                    plantasSel={plantasSel}
                  />
                </CCol>
                <CCol sm="auto">
                  <Periodo
                  mPeriodo={mPeriodo}
                  periodoSel={periodoSel}
                  />
                </CCol>
                <CCol sm="auto">
                  <Mes
                  mMes={mMes}
                  mesSel={mesSel}
                  />
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <CButton color='primary' onClick={sendPC}>
                      <CIcon icon={cilBell} className="me-2" />
                       Realizar
                    </CButton>
                </CCol>
              </CRow>
            </CForm>
        </CContainer>
        <TabulatorG titulo={'PreCierre'} posts={posts} />
    </>
    )
}
export default PreCierre