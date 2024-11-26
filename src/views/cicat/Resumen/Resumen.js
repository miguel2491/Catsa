import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import ResD from './ResDiario'
import ResE from './ResEntradas'
import ResS from './ResSalidas'
import ResED from './ResEntradasD'
import ResSD from './ResSalidasD'
import Plantas from '../../base/parametros/Plantas'
import FechaI from '../../base/parametros/FechaInicio'
import FechaF from '../../base/parametros/FechaFinal'
import {FormatoFca} from '../../../Utilidades/Tools.js'
import { format } from 'date-fns';


import {
  CForm,
  CFormSelect,
  CWidgetStatsF,
  CContainer,
  CButton,
  CRow,
  CCol,
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSearch, cilChartPie } from '@coreui/icons'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";


const Resumen = () => {
    const [mensaje , setMensaje] = useState('');
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [vFcaF, setFechaFin] = useState(null);
    const [btn1, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    //Arrays
    const [dMov, setMov] = useState([]);
    const hijoRef = useRef(); 
    const entradasRf = useRef();
    const salidasRf = useRef();
    const entradasDRf = useRef();
    const salidasDRf = useRef();

    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const cFechaI = (fecha) => {
        const formattedDate = format(fecha, 'yyyy/MM/dd');
        setFechaIni(formattedDate);
    };
    const mFcaF = (fcaF) => {
        const auxFca = format(fcaF, 'yyyy/MM/dd');
        setFechaFin(auxFca);
      };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };

    const getDatos = () => {
        if (hijoRef.current) {
            hijoRef.current.ejecutarAccion(); // Llama a la función del hijo
        }
        if(entradasRf.current)
        {
            entradasRf.current.getEntradas();    
        }
        if(salidasRf.current)
        {
            salidasRf.current.getSalidas();    
        }
        if(entradasDRf.current)
        {
            entradasDRf.current.getEntradasD();    
        }
        if(salidasDRf.current)
        {
            salidasDRf.current.getSalidasD();    
        }
        getMovs();
    }

    async function getMovs()
    {
        setVisible(!visible)
        setLoading(true);
        setPercentage(0);
        const interval = setInterval(() => {
            setPercentage(prev => {
            if (prev < 90) return prev + 10;
            return prev;
            });
        }, 20000);
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
            const fcaI = FormatoFca(vFechaI);
            const fcaF = FormatoFca(vFcaF);
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+plantasSel+','+fcaI+','+fcaF+',M', confi_ax);
            var obj = response.data[0].Rows;
            setMov(obj);
            //console.log(obj);
        } 
        catch(error)
        {
            console.log(error);
            Swal.fire("Error", "Ocurrio un error al cargar Movimientos, vuelva a intentarlo", "error");
        }finally{
            clearInterval(interval); // Limpiar el intervalo
            setLoading(false);
            setPercentage(100); 
            setVisible(false);
        }
    }
    
return (
    <>
        <CContainer fluid>
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
            <h3>Control de Inventarios</h3>
            <CRow>
                <CCol xs={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                    />
                </CCol>
                <CCol xs={2}>
                    <FechaF 
                        vFcaF={vFcaF} 
                        mFcaF={mFcaF}
                    />
                </CCol>
                <CCol xs={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={3} className='mt-3'>
                    <CButton color='primary' onClick={getDatos}>
                      <CIcon icon={cilSearch} className="me-2" />
                       Buscar
                    </CButton>
                    <CButton color='danger'>
                      <CIcon icon={cilCloudDownload} className="me-2" />
                       Exportar
                    </CButton>
                </CCol>
                
                <CCol xs={2}>
                    <label>Medida</label>
                    <CFormSelect 
                        options={[
                            'Medida',
                            { label: 'Kg', value: '1' },
                            { label: 'M3', value: '2' }
                        ]}
                    />
                </CCol>
            </CRow>
            <CRow>
                {
                    dMov.length === 0 ? (
                        <p></p>
                    ):(
                        dMov.map((itemd,index) => (
                            <CCol xs={2} key={itemd.Mov || index}>
                                <CWidgetStatsF
                                    className="mb-3"
                                    color="primary"
                                    title={itemd.Mov}
                                />
                            </CCol>
                        ))
                    )
                }
            </CRow>
            <br />
            <CTabs activeItemKey={1}>
                <CTabList variant="tabs" layout="fill">
                    <CTab aria-controls="R_Diario" itemKey={1}>Resumen Diario</CTab>
                    <CTab aria-controls="Entradas" itemKey={2}>Entradas</CTab>
                    <CTab aria-controls="Salidas" itemKey={3}>Salidas</CTab>
                    <CTab aria-controls="P_entradas_div" itemKey={4}>Entradas Diversas</CTab>
                    <CTab aria-controls="P_salidas_div" itemKey={5}>Salidas Diversas</CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="py-3" aria-labelledby="R_Diario" itemKey={1}>
                        <ResD ref={hijoRef} planta={plantasSel} fechaI={vFechaI} fechaF={vFcaF}/>
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="Entradas" itemKey={2}>
                        <ResE ref={entradasRf} planta={plantasSel} fechaI={vFechaI} fechaF={vFcaF} />
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="Salidas" itemKey={3}>
                        <ResS ref={salidasRf} planta={plantasSel} fechaI={vFechaI} fechaF={vFcaF} />
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="P_entradas_div" itemKey={4}>
                        <ResED ref={entradasDRf} planta={plantasSel} fechaI={vFechaI} fechaF={vFcaF} />
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="P_salidas_div" itemKey={5}>
                        <ResSD ref={salidasDRf} planta={plantasSel} fechaI={vFechaI} fechaF={vFcaF} />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        </CContainer>
    </>
    )
}
export default Resumen