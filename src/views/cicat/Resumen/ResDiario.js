import React, {useImperativeHandle, forwardRef, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca, Fnum} from '../../../Utilidades/Tools.js'
import { format } from 'date-fns';
import './cicat.css'
import {
    CBadge,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
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
import {getResInv, getResInvCB} from '../../../Utilidades/Funciones.js'

import {CIcon} from '@coreui/icons-react'
import { cilWarning, cilSearch } from '@coreui/icons'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";

const ResDiario = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)
    const [visibleM, setVisibleM] = useState(false);
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [vFcaF, setFechaFin] = useState(null);
    //Arrays
    const [dResumen, setResumen] = useState([]);
    const [aInvInt, setInvInt] = useState([]);
    const [aInvCB, setInvCB] = useState([]);
    const RefInvs = useRef(null); 

    const ejecutarAccion = () => {
        getRes(props.planta, props.fechaI, props.fechaF);
        setPlantas(props.planta);
        setFechaIni(props.fechaI);
        setFechaFin(props.fechaF);
    };
    useImperativeHandle(ref, () => ({
        ejecutarAccion,
    }));
    async function getRes(planta,FI,FF) {
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
            const fcaI = format(FI, 'yyyy-MM-dd');
            const fcaF = format(FF, 'yyyy-MM-dd');
            console.log(planta, fcaI, fcaF)
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',R', confi_ax);
            var obj = response.data[0].Rows;
            console.log(obj);
            if(obj.length > 0)
            {
                setResumen(obj);
                Swal.close();
            }
            
        } 
        catch(error)
        {
            Swal.close();
            Swal.fire("Error", "Ocurrio un error Resumen, vuelva a intentarlo", "error");
        }
    }
    const getMovInt = (item) =>{
        setLoading(true);
        setPercentage(0);
        setVisible(!visible);
        const interval = setInterval(() => {
            setPercentage(prev => {
            if (prev < 90) return prev + 10;
            return prev;
            });
        }, 1000); // Incrementa cada 500 ms
        getDataInv(item);
    }

    async function getDataInv(material)
    {
        var resulInt = false;
        var resulCB = false;
        const fcaI = format(props.fechaI, 'yyyy-MM-dd');
        const fcaF = format(props.fechaF, 'yyyy-MM-dd');
        resulInt = await getResInv(material, fcaI, fcaF, props.planta);
        if(resulInt)
            resulCB = await getResInvCB(material, fcaI, fcaF, props.planta)
        if(resulInt && resulCB)
        {
            setVisible(visible);
            setInvInt(resulInt);
            setInvCB(resulCB);
            setVisibleM(!visibleM);
            if(RefInvs.current){
                RefInvs.current.setInvs(resulInt, resulCB)
            }
        }else{
            setLoading(false);
            setPercentage(100); 
            setVisible(false);
            setInvInt([]);
            setInvCB([]);
            Swal.fire("Error", "No hay datos para este material", "error");
        }
    }

    return (
        <>
            <CContainer fluid>
                <h2 style={{ textAlign: 'center' }}>Resumen Diario</h2>
                <CCol xs={12}>
                <CTable responsive style={{fontSize:'10px'}}>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col"></CTableHeaderCell>
                            <CTableHeaderCell scope="col">Material</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Unidad</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Inventario Inicial</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Inicial ERP</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Inicial CB</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Entradas ERP</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Entradas CB</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Consumos ERP</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Consumos CB</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Final ERP</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Final CB</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {
                            dResumen.length === 0 ?(
                                <CTableRow>
                                    <CTableDataCell colSpan={13}>Sin datos</CTableDataCell>
                                </CTableRow>
                            ):(
                                dResumen.map((itemd,index) => (
                                    <CTableRow key={itemd.Material || index}>
                                        <CTableDataCell>
                                            <CButton color="primary" size="sm" title='Ver Movimientos Intelisis' onClick={()=>getMovInt(itemd.Material)}>
                                                <CIcon icon={cilSearch} className="me-2" />
                                            </CButton>
                                            <CModal
                                                backdrop="static"
                                                visible={visibleM}
                                                onClose={() => setVisibleM(false)}
                                                aria-labelledby="StaticBackdropExampleLabel"
                                                className='modalLg'
                                            >
                                                <CModalHeader>
                                                <CModalTitle id="StaticBackdropExampleLabel">Movimientos</CModalTitle>
                                                </CModalHeader>
                                                <CModalBody>
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <h3 className='center-text'>Intelisis</h3>
                                                        <CTable responsive style={{fontSize:'10px'}}>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell scope="col">Material</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Movimiento</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody style={{backgroundColor:'#f0f0f0'}}>
                                                                {
                                                                    aInvInt.length === 0 ? (
                                                                        <CTableRow>
                                                                            <CTableDataCell colSpan={4}>Sin datos</CTableDataCell>
                                                                        </CTableRow>
                                                                    ):(
                                                                        aInvInt.map((itemd, index) => (
                                                                            <CTableRow key={index}>
                                                                                <CTableDataCell>{itemd.Material}</CTableDataCell>
                                                                                <CTableDataCell>{format(itemd.Fecha, 'yyyy/MM/dd')}</CTableDataCell>
                                                                                <CTableDataCell>{Fnum(itemd.Cantidad)}</CTableDataCell>
                                                                                <CTableDataCell>{itemd.Mov}</CTableDataCell>
                                                                            </CTableRow>
                                                                        ))
                                                                    )
                                                                }
                                                            </CTableBody>
                                                        </CTable>
                                                    </CCol>
                                                    <CCol xs={6}>
                                                        <h3 className='center-text'>CB</h3>
                                                        <CTable responsive style={{fontSize:'10px'}}>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell scope="col">Material</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Movimiento</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody className='tCB'>
                                                                {
                                                                    aInvCB.length === 0 ? (
                                                                        <CTableRow>
                                                                            <CTableDataCell colSpan={4}>Sin datos</CTableDataCell>
                                                                        </CTableRow>
                                                                    ):(
                                                                        aInvCB.map((itemd, index) => (
                                                                            <CTableRow key={index}>
                                                                                <CTableDataCell>{itemd.Material}</CTableDataCell>
                                                                                <CTableDataCell>{format(itemd.Fecha, 'yyyy/MM/dd')}</CTableDataCell>
                                                                                <CTableDataCell>{Fnum(itemd.Cantidad)}</CTableDataCell>
                                                                                <CTableDataCell>{itemd.Mov}</CTableDataCell>
                                                                            </CTableRow>
                                                                        ))
                                                                    )
                                                                }
                                                            </CTableBody>
                                                        </CTable>
                                                    </CCol>
                                                </CRow>
                                                </CModalBody>
                                                <CModalFooter>
                                                <CButton color="secondary"onClick={() => setVisibleM(false)} >
                                                    Cerrar
                                                </CButton>
                                                </CModalFooter>
                                            </CModal>
                                        </CTableDataCell>
                                        <CTableDataCell>{itemd.Material}</CTableDataCell>
                                        <CTableDataCell>{itemd.Unidad}</CTableDataCell>
                                        <CTableDataCell>{format(itemd.FechaSem, 'yyyy/MM/dd')}</CTableDataCell>
                                        <CTableDataCell>{Fnum(itemd.InvFisicoS)}</CTableDataCell>
                                        <CTableDataCell className="colERP">{Fnum(itemd.InicioERPSP)}</CTableDataCell>
                                        <CTableDataCell className="colCB">{Fnum(itemd.InicioCBSP)}</CTableDataCell>
                                        <CTableDataCell className="colERP">
                                            <CRow>
                                                <CCol xs={6}>
                                                    {Fnum(itemd.EntradasERP)}
                                                </CCol>
                                                <CCol xs={3}>
                                                    {itemd.EntradasERP !== itemd.EntradasCB && (
                                                        <CBadge color="warning"><CIcon icon={cilWarning} className="me-2" /></CBadge>
                                                    )}
                                                </CCol>
                                            </CRow>                                            
                                        </CTableDataCell>
                                        <CTableDataCell className="colCB">
                                            <CRow>
                                                <CCol xs={6}>{Fnum(itemd.EntradasCB)}</CCol>
                                                <CCol xs={3}>
                                                    {itemd.EntradasERP !== itemd.EntradasCB && (
                                                        <CBadge color="warning"><CIcon icon={cilWarning} className="me-2" /></CBadge>
                                                    )}
                                                </CCol>
                                            </CRow>
                                        </CTableDataCell>
                                        <CTableDataCell className="colERP">
                                            <CRow>
                                                <CCol xs={6}>
                                                    {Fnum(itemd.SalidasERP)}
                                                </CCol>
                                                <CCol xs={3}>
                                                    {itemd.SalidasERP !== itemd.SalidasCB && (
                                                        <CBadge color="warning"><CIcon icon={cilWarning} className="me-2" /></CBadge>
                                                    )}
                                                </CCol>
                                            </CRow>
                                        </CTableDataCell>
                                        <CTableDataCell className="colCB">
                                            <CRow>
                                                <CCol xs={6}>
                                                    {Fnum(itemd.SalidasCB)}
                                                </CCol>
                                                <CCol xs={3}>
                                                    {itemd.SalidasERP !== itemd.SalidasCB && (
                                                        <CBadge color="warning"><CIcon icon={cilWarning} className="me-2" /></CBadge>
                                                    )}
                                                </CCol>
                                            </CRow>
                                        </CTableDataCell>
                                        <CTableDataCell className="colERP">
                                            <CRow>
                                                <CCol xs={6}>
                                                    {Fnum(itemd.InicioERP)}
                                                </CCol>
                                                <CCol xs={3}>
                                                    {itemd.InicioCB !== itemd.InicioERP && (
                                                        <CBadge color="warning"><CIcon icon={cilWarning} className="me-2" /></CBadge>
                                                    )}
                                                </CCol>
                                            </CRow>
                                        </CTableDataCell>
                                        <CTableDataCell className="colCB">
                                            <CRow>
                                                <CCol xs={6}>
                                                    {Fnum(itemd.InicioCB)}
                                                </CCol>
                                                <CCol xs={3}>
                                                    {itemd.InicioCB !== itemd.InicioERP && (
                                                        <CBadge color="warning">
                                                            <CIcon icon={cilWarning} className="me-2" />
                                                        </CBadge>
                                                    )}
                                                </CCol>
                                            </CRow>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            )
                        }
                    </CTableBody>
                </CTable>
            </CCol>
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
            </CContainer>
        </>
    );
});
export default ResDiario