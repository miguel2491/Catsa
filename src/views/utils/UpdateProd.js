import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import { format, parse, differenceInMinutes } from 'date-fns';
import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'
import { getUVez } from '../../Utilidades/Funciones';
const cookies = new Cookies();
const baseUrl2="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl="http://localhost:5001/api/";


const UpdateProd = () => {
    const [btn1, setDisabled] = useState(false);
    const [btn2, setDisabled2] = useState(false);
    const [btn3, setDisabled3] = useState(false);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [uHora, setUHora] = useState(format(new Date(),'yyyy/MM/dd HH:mm'));
    const [btnD, setBtnD] = useState(false);
    const [uHoraAct, setUHoraAct] = useState('-');
    const [usuarioAct, setUsuarioAct] = useState('-');
    useEffect(() => {
        getUVez_()
    }, []);
    const getUVez_ = async()=>{
        try{
            const ocList = await getUVez();
            if(ocList)
            {
                console.log(ocList)
                let uHra = ocList[0].fecha_creacion;
                let usuario = ocList[0].usuario;
                const parsedFecha1 = parse(uHora, 'yyyy/MM/dd HH:mm', new Date());
                const parsedFecha2 = new Date(uHra); // El formato ISO ya es compatible con Date en JavaScript
                setUHoraAct(format(uHra,'yyyy/MM/dd HH:mm'))
                setUsuarioAct(usuario)
                // Calculamos la diferencia en minutos
                const diferenciaEnMinutos = differenceInMinutes(parsedFecha1, parsedFecha2);
                console.log(diferenciaEnMinutos)
                if(diferenciaEnMinutos > 30){
                    setBtnD(true)
                }else{
                    setBtnD(false)
                }
            }
        }catch(error){
            console.log("Ocurrio un problema cargando Plantas....")
        }
    };

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
                const response = await axios.get(baseUrl2+'Administracion/SetSPPRecios/'+cookies.get('Usuario'), confi_ax);
                console.log(response.data);
                //Swal.fire("CORRECTO", "Se Agrego Correctamente", "success");
                //setPrecios2(true);
                //setSPrecios2();
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
            await axios.get(baseUrl2+'Administracion/SetSPPRecios2', confi_ax)
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
            await axios.get(baseUrl2+'Administracion/SetCMEdo', confi_ax)
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
            await axios.get(baseUrl2+'Administracion/SetPEntrada', confi_ax)
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
            await axios.get(baseUrl2+'Administracion/SetCISADB', confi_ax)
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
            await axios.get(baseUrl2+'Administracion/SetCISAPROD', confi_ax)
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
            const response = await axios.get(baseUrl2+'Administracion/SetAfectarMov', confi_ax);
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
                    <CButton color='primary' onClick={updPrecio} id='btnPaso1' style={{ display:btnD ? 'block':'none' }}>
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
                <CRow>
                    <label>Última Actualización:<b>{uHoraAct}</b> </label><br /><label>Por el Usuario: <b>{usuarioAct}</b></label>
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