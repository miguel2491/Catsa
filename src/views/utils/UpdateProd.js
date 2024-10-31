import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";

import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";


const UpdateProd = () => {
    const [btn1, setDisabled] = useState(false);
    const [btn2, setDisabled2] = useState(false);
    const [btn3, setDisabled3] = useState(false);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const updPrecio = () =>{
        setSPrecios()
    }
    async function setSPrecios()
    {
        setLoading(true);
        setPercentage(0);
        setDisabled(true);
        // Simular carga gradual
        const interval = setInterval(() => {
            setPercentage(prev => {
            if (prev < 90) return prev + 10; // Incrementa en 10 hasta 90%
            return prev;
            });
        }, 50000); // Incrementa cada 500 ms

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
                const response = await axios.get(baseUrl+'Administracion/SetSPPRecios', confi_ax);
                console.log(response.data);
                //Swal.fire("CORRECTO", "Se Agrego Correctamente", "success");
                //setPrecios2(true);
                setSPrecios2();
                
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
                
            }
    }
    async function setSPrecios2()
    {
        setDisabled2(false)
        try
        {
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
            await axios.get(baseUrl+'Administracion/SetSPPRecios2', confi_ax)
            .then(response=>{
                console.log(response.data);
                //Swal.fire("CORRECTO", "Finalizo proceso", "success");
                //setDisabled2(true);
                setPercentage(55);
                setCMEdo();
                //return response.data;
            })
            .catch(err=>{
                if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
                } else if (err.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error de Solicitud:', err.request);
                } else {
                    // Algo sucedió al configurar la solicitud
                    console.error('Error:', err.message);
                }
            })    
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            console.error(error);
        }
    }
    const updCopyMP = () =>{
        setCMEdo()
    }
    async function setCMEdo()
    {
        setDisabled2(false)
        try
        {
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
            await axios.get(baseUrl+'Administracion/SetCMEdo', confi_ax)
            .then(response=>{
                console.log(response.data);
                //Swal.fire("CORRECTO", "Primer Parte", "success");
                setDisabled2(true)
                setEntrada()
                setPercentage(55);
                //return response.data;
            })
            .catch(err=>{
                if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
                } else if (err.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error de Solicitud:', err.request);
                } else {
                    // Algo sucedió al configurar la solicitud
                    console.error('Error:', err.message);
                }
            })    
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            console.error(error);
        }
    }
    async function setEntrada()
    {
        try
        {
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
            await axios.get(baseUrl+'Administracion/SetPEntrada', confi_ax)
            .then(response=>{
                console.log(response.data);
                //Swal.fire("CORRECTO", "Proceso Finalizada", "success");
                setDisabled2(false)
                setDisabled3(true)
                setCISADB();
                //return response.data;
            })
            .catch(err=>{
                if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
                } else if (err.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error de Solicitud:', err.request);
                } else {
                    // Algo sucedió al configurar la solicitud
                    console.error('Error:', err.message);
                }
            })    
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            console.error(error);
        }
    }
    const updIntCISA = () =>{
        setCISADB();
    }
    async function setCISADB()
    {
        setDisabled3(false)
        try
        {
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
            await axios.get(baseUrl+'Administracion/SetCISADB', confi_ax)
            .then(response=>{
                console.log(response.data);
                //Swal.fire("CORRECTO", "PARTE1", "success");
                setCisaProd()
                //return response.data;
            })
            .catch(err=>{
                if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
                } else if (err.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error de Solicitud:', err.request);
                } else {
                    // Algo sucedió al configurar la solicitud
                    console.error('Error:', err.message);
                }
            })    
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            console.error(error);
        }
    }
    async function setCisaProd()
    {
        try
        {
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
            await axios.get(baseUrl+'Administracion/SetCISAPROD', confi_ax)
            .then(response=>{
                console.log(response.data);
                //Swal.fire("CORRECTO", "PARTE2", "success");
                setAfectarMov()
                setPercentage(80); 
                //return response.data;
            })
            .catch(err=>{
                if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
                } else if (err.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error de Solicitud:', err.request);
                } else {
                    // Algo sucedió al configurar la solicitud
                    console.error('Error:', err.message);
                }
            })    
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            console.error(error);
        }
    }
    async function setAfectarMov()
    {
        setLoading(true);
        setPercentage(95);
        try
        {
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
            const response = await axios.get(baseUrl+'Administracion/SetAfectarMov', confi_ax);
            console.log(response.data);
            Swal.fire("CORRECTO", "PROCESO FINALIZADO", "success");
            setPercentage(100); 
            setDisabled3(true)   
            //------------------------------------------------------------------------------------------------------------------------------------------------------
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
        }
    }
return (
    <>
        <CContainer fluid>
            <h1>Actualizar Producción</h1>
            <CForm>
                <CRow>
                <CCol sm="auto" className='mt-3'>
                    <CButton color='primary' onClick={updPrecio} id='btnPaso1' style={{ display:btn1 ? 'none':'block' }}>
                        <CIcon icon={cilLoopCircular} className="me-2" />
                        Paso 1
                    </CButton>
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <CButton color='secondary' onClick={updCopyMP} style={{ display:btn2 ? 'block':'none' }}>
                        <CIcon icon={cilLoopCircular} className="me-2" />
                        Paso 2
                    </CButton>
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <CButton color='light' onClick={updIntCISA}  style={{ display:btn3 ? 'block':'none' }}>
                        <CIcon icon={cilLoopCircular} className="me-2" />
                        Paso 3
                    </CButton>
                </CCol>
                </CRow>
                {loading && (
                    <CRow className="mt-3">
                    <ProgressBar completed={percentage} />
                    <p>Cargando: {percentage}%</p>
                    </CRow>
                )}
            </CForm>
        </CContainer>
    </>
    )
}
export default UpdateProd