import React, {useImperativeHandle, forwardRef, useState} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca, Fnum} from '../../../Utilidades/Tools.js'
import { format } from 'date-fns';
import './cicat.css'
import {
    CForm,
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

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const ResDiario = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)
    //Arrays
    const [dResumen, setResumen] = useState([]);

    const ejecutarAccion = () => {
        getRes(props.planta, props.fechaI, props.fechaF);
    };
    useImperativeHandle(ref, () => ({
        ejecutarAccion,
    }));
    async function getRes(planta,FI,FF) {
        setVisible(!visible)
        setLoading(true);
        setPercentage(0);
        const interval = setInterval(() => {
            setPercentage(prev => {
            if (prev < 90) return prev + 10;
            return prev;
            });
        }, 1000); // Incrementa cada 500 ms
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
            const fcaI = FormatoFca(FI);
            const fcaF = FormatoFca(FF);
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',R', confi_ax);
            var obj = response.data[0].Rows;
            //console.log(obj);
            if(obj.length > 0)
            {
                setResumen(obj);
            }
            
        } 
        catch(error)
        {
            Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
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
                <h2>Resumen Diario</h2>
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
                                        <CTableDataCell>-</CTableDataCell>
                                        <CTableDataCell>{itemd.Material}</CTableDataCell>
                                        <CTableDataCell>{itemd.Unidad}</CTableDataCell>
                                        <CTableDataCell>{format(itemd.FechaSem, 'yyyy/MM/dd')}</CTableDataCell>
                                        <CTableDataCell>{Fnum(itemd.InvFisicoS)}</CTableDataCell>
                                        <CTableDataCell className="colERP">{Fnum(itemd.InicioERPSP)}</CTableDataCell>
                                        <CTableDataCell className="colCB">{Fnum(itemd.InicioCBSP)}</CTableDataCell>
                                        <CTableDataCell className="colERP">{Fnum(itemd.EntradasERP)}</CTableDataCell>
                                        <CTableDataCell className="colCB">{Fnum(itemd.EntradasCB)}</CTableDataCell>
                                        <CTableDataCell className="colERP">{Fnum(itemd.SalidasERP)}</CTableDataCell>
                                        <CTableDataCell className="colCB">{Fnum(itemd.SalidasCB)}</CTableDataCell>
                                        <CTableDataCell className="colERP">{Fnum(itemd.InicioERP)}</CTableDataCell>
                                        <CTableDataCell className="colCB">{Fnum(itemd.InicioCB)}</CTableDataCell>
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