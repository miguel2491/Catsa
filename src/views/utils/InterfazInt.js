import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";

import {
  CForm,
  CFormSelect,
  CContainer,
  CButton,
  CRow,
  CCol,
  CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilBell, cilSearch } from '@coreui/icons'
import Plantas from '../base/parametros/Plantas'
import TabulatorG from '../base/tabs/TabulatorP'
import FechaI from '../base/parametros/FechaInicio'

const cookies = new Cookies();
const baseUrl="https://apicatsa2.catsaconcretos.mx:2533/api/";
const baseUrl2="http://localhost:2548/api/";


const InterfazInt = () => {
    const [plantasSel , setPlantas] = useState('');
    const [periodoSel , setPeriodo] = useState('');
    const [mesSel , setMes] = useState('');
    const [posts, setPosts] = useState([]);
    const [vFechaI, setFechaIni] = useState(null);

    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
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
        <CContainer fluid>
            <h1>Interfaz Intelisis</h1>
            <CForm>
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
                    <CFormSelect size="lg" className="mb-3" aria-label="Interfaz">
                        <option>Todos</option>
                        <option value="1">Producto</option>
                        <option value="2">Obras</option>
                        <option value="3">Cliente</option>
                    </CFormSelect>
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <CButton color='primary' onClick={sendPC}>
                      <CIcon icon={cilSearch} className="me-2" />
                       Realizar
                    </CButton>
                </CCol>
              </CRow>
            </CForm>
            <CRow>
            <CCol xs={12}>
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
                    <CTableRow>
                        <CTableDataCell colSpan={10}>Sin Datos</CTableDataCell>
                    </CTableRow>
                </CTableBody>
                <CTableHead>
                    <CTableRow>
                        <CTableDataCell colSpan={3}></CTableDataCell>
                        <CTableDataCell><b>0</b></CTableDataCell>
                        <CTableDataCell><b>0</b></CTableDataCell>
                        <CTableDataCell colSpan={5}></CTableDataCell>
                    </CTableRow>
                </CTableHead>
                </CTable>
            </CCol>
           
        </CRow>
        </CContainer>
    </>
    )
}
export default InterfazInt