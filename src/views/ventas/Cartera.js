import React, { useState, useEffect } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import {
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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardHeader,
    CCardBody,
    CFormSelect
} from '@coreui/react';
import '../../estilos.css';
import Asesores from '../base/parametros/Asesores'
import { CIcon } from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';
import { getProyeccion } from '../../Utilidades/Funciones';
import Swal from 'sweetalert2';
import { FormatoFca, Fnum} from '../../Utilidades/Tools'
import { format } from 'date-fns';

const RCartera = () => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);// Modal Cargando
    const [data, setData] = useState([]); // Estado para almacenar los datos de la tabla
    const [selectedAsesor, setSelectedAsesor] = useState('');
    const [asesorSel , setAsesor] = useState('');
    //Estilo
    const [isDetalle, setIsDetalle] = useState(false);    
    
    
    const mAsesor = (event) => {
        setAsesor(event.target.value);
    };

    const getAsesores = async () => {
        setLoading(true);
        setVisible(true); // Muestra el modal de carga

        try {
            
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            setLoading(false);
            setVisible(false); // Oculta el modal de carga
        }
    };

    return (
        <CContainer fluid>
            <h2 style={{ textAlign: 'left' }}>Cartera</h2>
            <CRow className='mb-2'>
                <CCol xs={6} md={4}>
                    <Asesores  
                        mAsesor={mAsesor}
                        asesoresSel={asesorSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CButton color='primary' className='mt-3' onClick={getAsesores}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Buscar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mb-1 mt-2'>
                
            </CRow>
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
                <CModalFooter />
            </CModal>
        </CContainer>
    );
};

export default RCartera;
