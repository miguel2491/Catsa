import React,{useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import './estilosTabs.css'
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
    const [dPRSol, setPRSol] = useState([]);
    const [TieReal , setTr] = useState('');
    const [DisKm , setKm] = useState('');
    const [sEnvios , setSends] = useState([]);
    const [ARec, setAR] = useState('');
    const [splitARec, setSplitARec] = useState([]);
    const [Tm3, setTM3] = useState(0);
    const [TEnv, setTEnv] = useState(0);
    const currentDate = new Date(); // Fecha actual del sistema

    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    
    useEffect(()=>{    
        if(dPRemisiones.length > 0)
            {
                console.log(dPRemisiones);
                // Función para agrupar los datos
                const sEnvios = () => {
                    const aux = [];
                    var cantidad = 0;
                     // Agrupa los datos
                    dPRemisiones.forEach(item => {
                        // Busca si ya existe un grupo para ese IdPedido
                        const existingGroup = aux.find(group => group.IdPedido === item.IdPedido);
                        if (existingGroup) {
                            // Si ya existe, suma el Enviado
                            existingGroup.totalEnviado += item.Cantidad;
                        } else {
                            // Si no existe, crea un nuevo grupo
                            aux.push({
                                IdPedido: item.IdPedido,
                                totalEnviado:item.Cantidad
                            });
                        }
                    });
                    return aux; // Devuelve el resultado
                };
                const groupedSends = sEnvios(); // Llama a la función
                setSends(groupedSends); // Actualiza el estado
            }    
    },[dPRemisiones]);
    
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const getTotalEnviado = (idPedido) => {
        const found = sEnvios.find(item => item.IdPedido === idPedido);
        return found ? parseFloat(found.totalEnviado).toFixed(2) : '0.00';
    };
    const sendGetPedidos = () =>{
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
                    var obj = response.data;//JSON.stringify(response.data);
                    if(obj.length>0){
                        console.log(response.data);
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
                            setPRemisiones(response.data)
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
    const getRPedido = (param, Tr, Dkm) =>{
        const resultado_ = dPRemisiones.filter(item => item.IdPedido === param);
        setTr(Tr)
        setKm(Dkm)
        setPRSol(resultado_)
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque los meses son 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const tReal = (treal, recorrido) => {
        if(treal == "0")
        {
            var aux_tr = recorrido;
            const result = aux_tr.split(":");
            var fmins = parseInt(result[1], 10) + 40
            var hrsDec = fmins / 60;
            var minsRes = fmins % 60;
            hrsDec += parseInt(result[0], 10)
            recorrido = hrsDec.toFixed(0) + "Hrs " + minsRes+" Min.";
        }
        else
        {
            recorrido = treal;
        }
        return `${recorrido}`;
    };
    const TotalM3 = dPedidos.reduce((acc, item) => {
        return acc + (parseFloat(item.M3) || 0); // Asegúrate de manejar posibles NaN
    }, 0);
    const TotalEnv = sEnvios.reduce((acc, item) => {
        return acc + (parseFloat(item.totalEnviado) || 0); // Asegúrate de manejar posibles NaN
    }, 0);
    const getHraSalida = (hraSalida) =>{
        const [horas, minutos] = hraSalida.split(":").map(Number);
        console.log(horas, minutos);
        const totalMin = horas * 60 + minutos + 15;
        const n_hrs = Math.floor(totalMin / 60) % 24;
        const n_min = totalMin % 60;
        console.log(totalMin);
        return `${String(n_hrs).padStart(2, '0')}:${String(n_min).padStart(2, '0')}`;
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
                <CTable responsive style={{fontSize:'10px'}}>
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
                        dPedidos.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={10}>Sin Datos</CTableDataCell>
                            </CTableRow>
                        ):(
                            dPedidos.map((item, index) => 
                            {
                                const itemDate = new Date(item.hrSalida); // Convertir la fecha del item a objeto Date

                                // Comparar las fechas
                                let colors = "";
                                if (itemDate < currentDate) {
                                    colors = "success";
                                } else if (itemDate > currentDate) {
                                    colors = "warning";
                                }
                                return (
                                    <CTableRow key={item.IdPedido || index} className={colors}>
                                        <CTableHeaderCell scope="row">
                                            <CLink onClick={() => getRPedido(item.IdPedido, item.TiempoReal, item.Distancia)}>
                                                {item.IdPedido}
                                            </CLink>
                                        </CTableHeaderCell>
                                        <CTableDataCell>{item.Obra}</CTableDataCell>
                                        <CTableDataCell>{item.Producto}</CTableDataCell>
                                        <CTableDataCell>{parseFloat(item.M3).toFixed(2)}</CTableDataCell>
                                        <CTableDataCell>{getTotalEnviado(item.IdPedido)}</CTableDataCell>
                                        <CTableDataCell>{formatDate(item.FechaHoraPedido)}</CTableDataCell>
                                        <CTableDataCell>{new Date(item.FechaHoraPedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                        <CTableDataCell>{new Date(item.hrSalida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                        <CTableDataCell>{tReal(item.TiempoReal, item.Recorrido)}</CTableDataCell>
                                        <CTableDataCell>{item.Distancia}</CTableDataCell>
                                    </CTableRow>
                                )
                            })
                        )
                    }
                </CTableBody>
                <CTableHead>
                    <CTableRow>
                        <CTableDataCell colSpan={3}></CTableDataCell>
                        <CTableDataCell><b>{TotalM3}</b></CTableDataCell>
                        <CTableDataCell><b>{TotalEnv}</b></CTableDataCell>
                        <CTableDataCell colSpan={5}></CTableDataCell>
                    </CTableRow>
                </CTableHead>
                </CTable>
            </CCol>
            <CCol xs={6}>
                <CTable responsive style={{fontSize:'10px'}}>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">Remisión</CTableHeaderCell>
                        <CTableHeaderCell scope="col">TR</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{width:'300px'}}>Conductor</CTableHeaderCell>
                        <CTableHeaderCell scope="col">M3</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Acumulado</CTableHeaderCell>
                        <CTableHeaderCell scope="col">InicioCarga</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Fin Carga</CTableHeaderCell>
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
                        dPRSol.length === 0 ?(
                            <CTableRow>
                                <CTableDataCell colSpan={14}>Sin datos</CTableDataCell>
                            </CTableRow>
                        ):(
                            dPRSol.map((itemd,index) => (
                                <CTableRow key={itemd.NoRemision || index}>
                                    <CTableDataCell>{itemd.NoRemision}</CTableDataCell>
                                    <CTableDataCell>{itemd.TR}</CTableDataCell>
                                    <CTableDataCell style={{width:'300px'}}>{itemd.Conductor}</CTableDataCell>
                                    <CTableDataCell>{parseFloat(itemd.Cantidad).toFixed(2)}</CTableDataCell>
                                    <CTableDataCell>{parseFloat(itemd.Enviado).toFixed(2)}</CTableDataCell>
                                    <CTableDataCell>{new Date(itemd.InicioCarga).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                    <CTableDataCell>{new Date(itemd.SalioDePlanta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                    <CTableDataCell>{getHraSalida(new Date(itemd.SalioDePlanta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</CTableDataCell>
                                    <CTableDataCell>{new Date(itemd.LlegoAObra).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                    <CTableDataCell>{new Date(itemd.RegresaDeObra).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                    <CTableDataCell>{new Date(itemd.LlegoAPlanta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CTableDataCell>
                                    <CTableDataCell>{itemd.TiempoCiclo}</CTableDataCell>
                                    <CTableDataCell>{parseFloat(itemd.DistanciaKm).toFixed(2)}</CTableDataCell>
                                    <CTableDataCell>{TieReal}</CTableDataCell>
                                    <CTableDataCell>{DisKm}</CTableDataCell>
                                </CTableRow>
                            ))
                        )
                    }
                </CTableBody>
                </CTable>
            </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default PLinea
