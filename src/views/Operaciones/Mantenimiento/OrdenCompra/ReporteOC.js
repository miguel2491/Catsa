import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../../base/parametros/FechaInicio';
import FechaF from '../../../base/parametros/FechaFinal';
import Plantas from '../../../base/parametros/Plantas';
import '../../../../estilos.css';
import BuscadorDT from '../../../base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getOCompras, setOCompra, delOCompra, getOComprasInd, setStatusOC, getVehiculos, addNFac } from '../../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CImage,
    CBadge,
    CFormTextarea,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import { IMaskMixin } from 'react-imask'
import IMask from 'imask'
import { jsPDF } from "jspdf";
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilCloudDownload, cilPlus, cilPrint, cilSave, cilSearch, cilShareAlt, cilShortText, cilTag, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"

import "react-datepicker/dist/react-datepicker.css"
const ReporteOC = () => {
    //************************************************************************************************************************************************************************** */
    const [plantasSel , setPlantas] = useState('');
    const [plantasSelF , setPlantasF] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [vOC, setVOC] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtOrdenes, setDTOrdenes] = useState([]);
    const [cmbVehiculo, setVehiculo] = useState([]);
    const [exOC, setExOc] = useState([]);
    // FROMS
    const [nOrden, setNorden] = useState("");
    const [urlImg, setUrlImg] = useState('');
    //************************************************************************************************************************************************************************** */
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIsJP ? false : true;
    //************************************************************************************************************************************************************************** */
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const mCambioF = (event) => {
        setPlantasF(event.target.value);
    };
    // Función para manejar el cambio del archivo
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Solo se guardará el primer archivo seleccionado
    };
    //************************************************************************************************************************************************************************** */
    const getOComprasBtn = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOC();
            }
        });
    }
    const gOC = async () => {
        var planta = plantasSel;
        if(plantasSel == undefined || plantasSel.length == 0 || plantasSel === ""){
            if(userIsJP && !userIsOperacion)
            {
                Swal.close();
                Swal.fire("Error", "Debes seleccionar alguna planta", "error");
                return false;
            }else {
                setPlantas('0')
                planta = '0'
            }
        }
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try{
            const ocList = await getOCompras(planta, auxFcaI, auxFcaF);
            if(ocList)
            {
                setDTOrdenes(ocList);
                setExOc(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const addOC = (id) =>{
        setVOC(true)
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOCI(id);
            }
        });
    }
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    useEffect(() => {
        //getProductosInt_(null);
    }, []);
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const nOrdenCh = (e) =>{
        setNorden(e.target.value);
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const handleDescMant = (e) => {
        setDMan(e.target.value);
    }
    //************************************************************************************************************************************************************************************* */
    return (
    <>
        <CContainer fluid>
            <h3>Orden Compra </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={3} lg={3}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={3} lg={3}>
                    <FechaF 
                        vFcaF={vFechaF} 
                        mFcaF={mFcaF}
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2} lg={3}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
            </CRow>
            <br />
        </CContainer>
    </>
    )
}
export default ReporteOC