import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import Periodo from '../base/parametros/Periodo'
import Mes from '../base/parametros/Mes'

import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";


const UpdateMB = () => {
    const [btn3, setDisabled3] = useState(false);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [periodoSel , setPeriodo] = useState('');
    const [mesSel , setMes] = useState('');
    const [visible, setVisible] = useState(false)
    const mPeriodo = (event) => {
        setPeriodo(event.target.value);
    };
    const mMes = (event) => {
        setMes(event.target.value);
    };
    const comenzarMB = () =>{
       
        setMB(periodoSel,mesSel)
    }
    async function setMB(mes,ejercicio)
    {
        if(mes === "" || ejercicio === "")
        {
            Swal.fire("AVISO", "Valida que no esten vacios", "error");
        }else{     
            setVisible(!visible)       
            setLoading(true);
            setPercentage(0);
            setDisabled3(true);
            // Simular carga gradual
            const interval = setInterval(() => {
                setPercentage(prev => {
                if (prev < 90) return prev + 10; // Incrementa en 10 hasta 90%
                return prev;
                });
            }, 5000); // Incrementa cada 500 ms

            try
                {
                    let confi_ax = {
                        headers:
                        {
                            'Cache-Control': 'no-cache',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer "+cookies.get('token'),
                        },
                    };
                    //------------------------------------------------------------------------------------------------------------------------------------------------------
                    const response = await axios.get(baseUrl2+'Administracion/SetMB/'+ejercicio+','+mes, confi_ax);
                    setDisabled3(false);
                    Swal.fire("CORRECTO", "Se Agrego Correctamente", "success");                
            } 
            catch(error)
            {
                if(error.response)
                {
                    console.error('Error de Respuesta:', error.response.data);
                }
                else if(error.request)
                {
                    console.error('Error de Solicitud:', error.request);
                }
                else
                {
                    console.error('Error:', error.message)
                }
            }finally{
                clearInterval(interval); // Limpiar el intervalo
                setLoading(false);
                setPercentage(100); 
                setVisible(false);
            }
        }
    }
    
return (
    <>
        <CContainer fluid>
            <h1>Actualizar MB</h1>
            <CForm>
                <CRow>
                <CCol sm="auto" className='mt-3'>
                    <Periodo
                        mPeriodo={mPeriodo}
                        periodoSel={periodoSel}
                    />
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <Mes
                        mMes={mMes}
                        mesSel={mesSel}
                    />
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <br></br>
                    <CButton color='light' onClick={comenzarMB} style={{ display:btn3 ? 'none':'block' }}>
                        <CIcon icon={cilLoopCircular} className="me-2" />
                        Comenzar
                    </CButton>
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
                        <CModalFooter>
                        
                        </CModalFooter>
                    </CModal>
                </CCol>
                </CRow>
                
            </CForm>
        </CContainer>
    </>
    )
}
export default UpdateMB