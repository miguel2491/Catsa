import React, {useImperativeHandle, forwardRef, useState} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca} from '../../../Utilidades/Tools.js'
import { format } from 'date-fns';

import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CContainer,
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

const ResEntradas = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)
    //Arrays
    const [dEntradas, putEntradas] = useState([]);
    const getEntradas = () => {
        setEntradas(props.planta, props.fechaI, props.fechaF);
    };
    useImperativeHandle(ref, () => ({
        getEntradas,
    }));
    async function setEntradas(planta, FI, FF) {
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
            const response = await axios.get(baseUrl2+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',DE', confi_ax);
            var obj =  response.data[0].Rows;
            putEntradas(obj);
            //console.log(obj);
        } 
        catch(error)
        {
            Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
        }finally{
            
        }
    }
    return (
        <>
            <CContainer fluid>
                <h2>Resumen Entradas</h2>
                <CCol xs={12}>
                <CTable responsive style={{fontSize:'10px'}}>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Entrada</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Mov</CTableHeaderCell>

                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {
                            dEntradas.length === 0 ?(
                                <CTableRow>
                                    <CTableDataCell colSpan={2}>Sin datos</CTableDataCell>
                                </CTableRow>
                            ):(
                                dEntradas.map((itemd,index) => (
                                    <CTableRow key={itemd.Entrada || index}>
                                        <CTableDataCell>{format(itemd.Fecha_Entrada, 'yyyy/MM/dd')}</CTableDataCell>
                                        <CTableDataCell>{itemd.Mov}</CTableDataCell>
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
export default ResEntradas