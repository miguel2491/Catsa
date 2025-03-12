import React, {useImperativeHandle, forwardRef, useState} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca, Fnum} from '../../../Utilidades/Tools.js'
import {setEntradasD} from '../../../Utilidades/Funciones.js'
import { format } from 'date-fns';

import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'

const cookies = new Cookies();

const ResEntradasD = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)
    //Arrays
    const [dEntradasD, setEntradasDv] = useState([]);
    const [dHeaders, putHeaders] = useState([]);

    const getEntradasD = () => {
        setEntradasD_(props.planta, props.fechaI, props.fechaF);
    };
    
    useImperativeHandle(ref, () => ({
        getEntradasD,
    }));

    const setEntradasD_ = async(planta, FI, FF) => {
        try
        {
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const ocList = await setEntradasD(planta, auxFcaI, auxFcaF);
            if(ocList)
            {
                setEntradasDv(ocList);
                putHeaders(Object.keys(ocList[0]));
            }
        } 
        catch(error)
        {
            console.log(error)
        }
    }

    return (
        <>
            <CContainer fluid>
                <h3>Resumen Entradas Diversas</h3>
                <CCol xs={12}>
                    <CTable responsive style={{fontSize:'10px'}}>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Entrada</CTableHeaderCell>
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
                                dEntradasD.length === 0 ?(
                                    <CTableRow>
                                        <CTableDataCell colSpan={2}>Sin datos</CTableDataCell>
                                    </CTableRow>
                                ):(
                                    dEntradasD.map((itemd,index) => (
                                        <CTableRow key={itemd.Entrada || index}>
                                            <CTableDataCell>{format(itemd.Fecha_Entrada, 'yyyy/MM/dd')}</CTableDataCell>
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
            </CContainer>
        </>
    );
});
export default ResEntradasD