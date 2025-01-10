import React, {useImperativeHandle, forwardRef, useState} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca, Fnum} from '../../../Utilidades/Tools.js'
import {format} from 'date-fns';

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

const ResSalidasD = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)
    //Arrays
    const [dSalidasD, setSalidasDv] = useState([]);
    const [dHeaders, putHeaders] = useState([]);

    const getSalidasD = () => {
        setSalidasD(props.planta, props.fechaI, props.fechaF);
    };
    
    useImperativeHandle(ref, () => ({
        getSalidasD,
    }));

    async function setSalidasD(planta, FI, FF) {
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
            const fcaI = FormatoFca(FI);
            const fcaF = FormatoFca(FF);
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',SD', confi_ax);
            var obj =  response.data[0].Rows;
            console.log(obj);
            putHeaders(Object.keys(obj[0]));
            setSalidasDv(obj)
        } 
        catch(error)
        {
            console.log(error)
        }finally{
           
        }
    }
    return (
        <>
            <CContainer fluid>
                <h2>Resumen Salidas Diversas</h2>
                <CCol xs={12}>
                    <CTable responsive style={{fontSize:'10px'}}>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Salida Diversa</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Mov</CTableHeaderCell>
                                {
                                    dHeaders.map((itemd,index) => {
                                        if (index < 3) {
                                            return null; // Si el índice es menor a 3, no renderizar nada
                                        }
                                        return(
                                            <CTableHeaderCell key={itemd || index} scope="col">{itemd}</CTableHeaderCell>
                                        )
                                    })
                                }
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                dSalidasD.length === 0 ?(
                                    <CTableRow>
                                        <CTableDataCell colSpan={dHeaders.length+2}>Sin datos</CTableDataCell>
                                    </CTableRow>
                                ):(
                                    dSalidasD.map((itemd,index) => (
                                        <CTableRow key={itemd.Entrada || index}>
                                            <CTableDataCell>{format(itemd.Fecha_Salida, 'yyyy/MM/dd')}</CTableDataCell>
                                            <CTableDataCell>{itemd.Mov}</CTableDataCell>
                                            {
                                            dHeaders.map((item, index_) => {
                                                // Si el índice es menor a 3, no renderizamos nada
                                                if (index_ < 3) {
                                                  return null;
                                                }
                                                
                                                // Accedemos al valor de 'item' en 'itemd', y si es undefined, mostramos 'Valor no disponible'
                                                const value = itemd[item];
                                                const renderableValue = value != null ? value : 'Valor no disponible';
                                                const valueToDisplay = typeof renderableValue === 'object' ? Fnum(0) : Fnum(renderableValue);
                                                // Si el valor es nulo o indefinido, se coloca un texto alternativo
                                                return (
                                                  <CTableDataCell key={item || index_}>
                                                    {valueToDisplay}
                                                  </CTableDataCell>
                                                );
                                            })
                                        }
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
export default ResSalidasD