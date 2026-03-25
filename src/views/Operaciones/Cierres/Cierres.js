import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import DataTable from 'react-data-table-component';
import { getCierres } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormLabel,
    CFormInput,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
} from '@coreui/react'
import '../../../estilos.css';
import {CIcon} from '@coreui/icons-react'
import { cilCameraControl, cilSearch } from '@coreui/icons'
import {FormatoFca} from '../../../Utilidades/Tools.js'
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
import { format } from 'date-fns';


const Cierres = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    
    const [txtFca, setTxtFca] = useState('');
    const [txtM3Pro, setTxtM3] = useState('');
    const [txtM3Bom, setTxtBom] = useState('');
    const [txtM3Tir, setTxtM3Tir] = useState('');
    
    const [dtCierres, setDTCierres] = useState([]);
    
    const [shDiv, setShDiv] = useState(true);
    const [visible, setVisible] = useState(false);


    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    
    // Productos
    const colCie = [
        {
            name: 'Material',
            selector: row => row.Item,
            sortable:true,
            width:"200px",
        },{
            name: 'INV FINAL CB',
            selector: row => row.UOM,
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'INV FINAL PROCATSA',
            selector: row => row.Qty,
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'INV FINAL FISICO',
            selector: row => row.Metros,
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'DIF',
            selector: row => row.Metros,
            width:"150px",
            sortable:true,
            grow:1,
        },
    ]; 
    //-----------------------------------------
    const cFechaI = (fecha) => {
        const formateada = fecha.toLocaleDateString('en-US', opcionesFca);
        setFechaIni(formateada);
        setTxtFca(formateada);
    };
    const mFcaF = (fcaF) => {
        const auxFca = format(fcaF, 'yyyy/MM/dd');
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
        getSimulador(event.target.value);
        getProductos(event.target.value);
    };
    useEffect(() => {
        const fecha = new Date().toISOString().split('T')[0];
        //const formateada = fecha.toLocaleDateString('en-US', opcionesFca);
        setTxtFca(fecha);
    }, []);
    const bCierres = async () =>{
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try {
            const cierres = await getCierres(plantasSel, auxFcaI, auxFcaF);
            if (cierres) {
                setDTCierres(cierres)
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value)
        setFText(e.target.value)
    }
    const fBusqueda = () => {
        if (vBPlanta.length != 0) {
            const valFiltrados = dtCierres.filter(
                (dtCierres) => dtCierres.Planta.includes(vBPlanta),
            )
        } else {
            bCierres()
        }
    }
    const fCie = dtCierres.filter((item) => {
        return item.Planta.toString().includes(fText.toUpperCase())
    })
    //************************************************************************************************************************************************************************** */
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
               
            </CModalBody>
            <CModalFooter>
            
            </CModalFooter>
        </CModal>
        <h3>CIERRE DE MES </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <FechaF 
                        vFcaF={vFechaF} 
                        mFcaF={mFcaF}
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={3}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={3} className='mt-1'>
                    <br />
                    <CButton color='primary' onClick={()=>bCierres()} > 
                        <CIcon icon={cilSearch} />
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={3} md={3}>
                    <CFormLabel>
                        Fecha
                    </CFormLabel>
                    <CFormInput
                        type="text"
                        disabled
                        value={txtFca}
                        locale="es"
                        className='form-control'
                        dateFormat="yyyy/MM/dd" 
                    />
                </CCol>
                <CCol xs={3} md={3}>
                    <CFormLabel>M3 PRODUCIDOS</CFormLabel>
                    <CFormInput type="text" disabled value={txtM3Pro} />
                </CCol>
                <CCol xs={3} md={3}>
                    <CFormLabel>M3 BOMBEADOS</CFormLabel>
                    <CFormInput type="text" disabled value={txtM3Bom} />
                </CCol>
                <CCol xs={3} md={3}>
                    <CFormLabel>M3 TIRADOS</CFormLabel>
                    <CFormInput type="text" disabled value={txtM3Tir} />
                </CCol>
            </CRow>
            <CRow className='mt-4 mb-2'>
                <CCol xs={12} md={12} >
                    {shDiv &&(
                        <DataTable
                            columns={colCie}
                            data={fCie}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    )}
                </CCol>
            </CRow>
        </CContainer>
    </>
    )
}
export default Cierres
