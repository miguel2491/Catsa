import React,{useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";

import {
    CLink,
    CContainer,
    CRow,
    CCol,
    CButton,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell
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

const PLinea = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [dPedidos, setPedidos] = useState([]);
    const [dPRemisiones, setPRemisiones] = useState([]);
    
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    
    useEffect(()=>{    
        if(vFechaI!=null)
        {
            //Swal.fire("INFO!", "Buen Trabajo!", "danger");
            if(plantasSel.length >0 && vFechaI.length > 0)
                {
                    //GetPLinea();
                }
            }
    });
    
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
  
    const sendGetPedidos = () =>{
        console.log(plantasSel, vFechaI)
        GetPLinea(plantasSel, vFechaI)
    }
    async function GetPLinea(planta, fechaI)
  {
    if(vFechaI != "")
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
            const fcaIni = vFechaI.split('/');
            let auxFcaI = fcaIni[2]+"-"+fcaIni[0]+"-"+fcaIni[1];
            if(plantasSel.length > 0){
                //--------------------------------------------------
                axios.get(baseUrl2+'Logistica/GetPLinea/'+plantasSel+','+auxFcaI,confi_ax)
                .then(response=>{
                    var obj = JSON.stringify(response.data);
                    if(obj.length>0){
                        obj = JSON.parse(obj);
                        console.log(obj)
                        setPedidos(obj)
                        GetPRemisiones();
                    }else{    
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                            footer: '<a href="#">Why do I have this issue?</a>'
                        });
                    }
                }).catch(err=>{
                    if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
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
    async function GetPRemisiones(planta, fechaI)
    {
        if(vFechaI != "")
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
                const fcaIni = vFechaI.split('/');
                let auxFcaI = fcaIni[2]+"-"+fcaIni[0]+"-"+fcaIni[1];
                if(plantasSel.length > 0){
                    //--------------------------------------------------
                    axios.get(baseUrl2+'Logistica/GetPLineaR/'+plantasSel+','+auxFcaI,confi_ax)
                    .then(response=>{
                        var obj = JSON.stringify(response.data);
                        if(obj.length>0){
                            obj = JSON.parse(obj);
                            console.log(obj)
                            setPRemisiones(obj)
                        }else{    
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Something went wrong!",
                                footer: '<a href="#">Why do I have this issue?</a>'
                            });
                        }
                    }).catch(err=>{
                        if (err.response) {
                        // El servidor respondió con un código de estado fuera del rango de 2xx
                        console.error('Error de Respuesta:', err.response.data);
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
    const getRPedido = (param) =>{
        alert(`A:${param}`)
        console.log(dPRemisiones);
        const resultado_ = dPRemisiones.find(item => item.IdPedido === param);
        console.log(resultado_);
    }
  return (
    <>
      <CContainer fluid>
        <h1>Pedidos en Línea</h1>
        <CRow>
          <CCol sm="auto">
            <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
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
                Buscar
            </CButton>
            </CCol>
        </CRow>
        <CRow>
            <CCol xs={6}>
                <CTable responsive style={{fontSize:'12px'}}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">Pedido</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Obra</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Producto</CTableHeaderCell>
                        <CTableHeaderCell scope="col">M3</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Enviados</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Solicitado</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Hora Salida</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tiempo Real</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Distancia (KM)</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        dPedidos.map(item => (
                        <CTableRow>
                            <CTableHeaderCell scope="row">
                                <CLink onClick={() => getRPedido(item.IdPedido)}>
                                    {item.IdPedido}
                                </CLink>
                            </CTableHeaderCell>
                            <CTableDataCell>{item.Obra}</CTableDataCell>
                            <CTableDataCell>{item.Producto}</CTableDataCell>
                            <CTableDataCell>{item.M3}</CTableDataCell>
                            <CTableDataCell>{item.Enviados}</CTableDataCell>
                            <CTableDataCell>{item.FechaHoraPedido}</CTableDataCell>
                            <CTableDataCell>{item.hrSalida}</CTableDataCell>
                            <CTableDataCell>{item.M3}</CTableDataCell>
                            <CTableDataCell>{item.TiempoReal}</CTableDataCell>
                            <CTableDataCell>{item.Distancia}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
                </CTable>
            </CCol>
            <CCol xs={6}>
                <CTable responsive style={{fontSize:'12px'}}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">Remisión</CTableHeaderCell>
                        <CTableHeaderCell scope="col">TR</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Conductor</CTableHeaderCell>
                        <CTableHeaderCell scope="col">M3</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Acumulado</CTableHeaderCell>
                        <CTableHeaderCell scope="col">InicioCarga</CTableHeaderCell>
                        <CTableHeaderCell scope="col">SalioDePlanta</CTableHeaderCell>
                        <CTableHeaderCell scope="col">LlegoAObra</CTableHeaderCell>
                        <CTableHeaderCell scope="col">RegresoDeObra</CTableHeaderCell>
                        <CTableHeaderCell scope="col">LlegoAPlanta</CTableHeaderCell>
                        <CTableHeaderCell scope="col">TiempoCiclo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Distancia (KM)</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Distancia Real</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tiempo Real</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        dPRemisiones.map(item => (
                        <CTableRow>
                            <CTableHeaderCell scope="row">
                                {item.IdPedido}
                            </CTableHeaderCell>
                            <CTableDataCell>{item.Obra}</CTableDataCell>
                            <CTableDataCell>{item.Producto}</CTableDataCell>
                            <CTableDataCell>{item.M3}</CTableDataCell>
                            <CTableDataCell>{item.Enviados}</CTableDataCell>
                            <CTableDataCell>{item.FechaHoraPedido}</CTableDataCell>
                            <CTableDataCell>{item.hrSalida}</CTableDataCell>
                            <CTableDataCell>{item.M3}</CTableDataCell>
                            <CTableDataCell>{item.TiempoReal}</CTableDataCell>
                            <CTableDataCell>{item.Distancia}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
                </CTable>
            </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default PLinea
