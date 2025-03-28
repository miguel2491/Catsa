import React, {useImperativeHandle, forwardRef, useState} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca, Fnum} from '../../../Utilidades/Tools.js'
import {setEntradas} from '../../../Utilidades/Funciones' 
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

const ResEntradas = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)
    //Arrays
    const [dEntradas, putEntradas] = useState([]);
    const [dHeaders, putHeaders] = useState([]);
    const getEntradas = () => {
        setEntradas_(props.planta, props.fechaI, props.fechaF);
    };
    useImperativeHandle(ref, () => ({
        getEntradas,
    }));
    
    const setEntradas_ = async(planta, FI, FF)=>{
        try{
            const ocList = await setEntradas(planta, auxFcaI, auxFcaF);
            if(ocList)
            {
                setDTOrdenes(ocList);
                setExOc(ocList);
            }
        }catch(error){
            //Swal.close();
            //Swal.fire("Error", "No se pudo obtener la información de Entradas", "error");
        }
        var obj =  response.data[0].Rows;
        //console.log(obj)
        putEntradas(obj);
        putHeaders(Object.keys(obj[0]));
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
                            dEntradas.length === 0 ?(
                                <CTableRow>
                                    <CTableDataCell colSpan={dHeaders.length+2}>Sin datos</CTableDataCell>
                                </CTableRow>
                            ):(
                                dEntradas.map((itemd,index) => (
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