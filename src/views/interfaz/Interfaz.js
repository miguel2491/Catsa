import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
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
import '../../estilos.css';
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

import IProducto from './Producto'
import IDTable from './Tabla'
const Interfaz = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    //Arrays
    const iProRf = useRef(); 
    const iTab = useRef(); 
    const cFechaI = (fecha) => {
        const formattedDate = format(fecha, 'yyyy/MM/dd');
        setFechaIni(formattedDate);
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };

    const getDatos = () => {
        if (iProRf.current) {
            iProRf.current.eAccion();
        }
        if (iTab.current) {
            iTab.current.eAccion();
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
            <h3>Interfaz Productos</h3>
            <CRow>
                <CCol xs={6} md={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={3} className='mt-3'>
                    <CButton color='primary' onClick={getDatos}>
                      <CIcon icon={cilSearch} className="me-2" />
                       Buscar
                    </CButton>
                </CCol>
            </CRow>
            <br />
            <CTabs activeItemKey={1}>
                <CTabList variant="tabs" layout="fill">
                    <CTab aria-controls="Producto" itemKey={1}>Producto</CTab>
                    <CTab aria-controls="Material" itemKey={2}>Materiales</CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="py-3" aria-labelledby="I_Producto" itemKey={1}>
                        <IProducto ref={iProRf} planta={plantasSel} fechaI={vFechaI} />
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="I_Material" itemKey={2}>
                        <IDTable ref={iTab} planta={plantasSel} fechaI={vFechaI} />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        </CContainer>
    </>
    )
}
export default Interfaz