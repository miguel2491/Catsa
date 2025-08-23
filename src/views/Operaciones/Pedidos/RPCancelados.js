import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import '../../../estilos.css';
import { getPC, getPlantasList, convertArrayOfObjectsToCSV } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilSearch,cilCloudDownload } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"
const currentDate = new Date();
const RPCancelados = () => {
    //************************************************************************************************************************************************************************** */
    const [plantasSelF , setPlantasF] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [loadingPC, setLoadingPC] = useState(false);
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Arrays
    const [dtPC, setDTPC] = useState([]);
    const [exPCan, setExPCan] = useState([]);
    //Buscador
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
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
        setFechaIni(fecha);
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF);
    };
    //********************************************************************** GRÁFICAS ******************************************************************************************************** */
    const [dtPlantas, setDTPlantas] = useState([]);
    //************************************************************************************************************************************************************************** */
    const getPC_ = () =>{
        setDTPC([]);
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gPC();
            }
        });
    }
    const gPC = async () => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try{
            const ocList = await getPC(auxFcaI, auxFcaF);
            if(ocList)
            {
                // Actualiza el estado con los nuevos datos
                setDTPC(ocList);
                setExPCan(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const getPlantas = async()=>{
        try{
            const ocList = await getPlantasList();
            if(ocList)
            {
                setDTPlantas(ocList)
            }
        }catch(error){
            console.log("Ocurrio un problema cargando Plantas....")
        }
    }   
    // Columnas de la tabla
    const colCan = [
        {
            name: 'Planta',
            width:"150px",
            selector: row => row.Planta,
            sortable:true,
        },
        {
            name: 'No. Remisión',
            width:"150px",
            selector: row => row.NoRemision,
            sortable:true,
        },
        {
            name: 'Producto',
            width:"150px",
            selector: row => row.Producto,
            sortable:true,
        },
        {
            name: 'Fecha',
            selector: row => {
                const fecha = row.Fecha;
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                }
                if (typeof fecha === 'object') {
                    return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'Hora',
            selector: row => {
                const fecha = row.Fecha;
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                }
                if (typeof fecha === 'object') {
                    return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
                return hora;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'NoObra',
            selector: row => row.NoObra,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Pedido',
            selector: row => row.Pedido,
            width:"180px",
            sortable:true,
            grow:1,
        },
    ];
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getPlantas();
        if (plantasSelF) {
            setLoadingPC(true);
            getPC_();
        }
    }, [plantasSelF]);
    //************************************************************************************************************************************************************************************** */
    const mCambio = (event) => {
        const planta = event.target.value;
        setPlantasF(planta);
    };
    // Búsqueda
    const onFindBusqueda = (e) => {
        setFText(e.target.value);
    };
    const fBusqueda = () => {

    };
    // Descargar CSV
    const downloadCSV = () => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exPCan);
        if (csv == null) return;
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        const filename = 'PCancelados_'+plantasSelF+'_'+auxFcaI+'_'+auxFcaF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    const fDCancelado = dtPC.filter(item => {
        return (
            item.Planta.includes(fText) && item.Planta.includes(plantasSelF)
        );
    },[dtPC,fText, plantasSelF]);
    //************************************************************************************************************************************************************************************* */
    return (
    <>
        <CContainer fluid>
            <h3>Reporte Pedido Cancelados </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2} lg={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <FechaF 
                        vFcaF={vFechaF} 
                        mFcaF={mFcaF}
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={3} lg={3}>
                    <label>Planta</label>
                    <CFormSelect aria-label="Selecciona" value={plantasSelF} onChange={mCambio}>
                        <option value="" >Selecciona...</option>
                        {dtPlantas.map((planta, index) =>(
                            <option value={planta.IdPlanta} key={index}>{planta.Planta}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='primary' onClick={getPC_}> 
                        <CIcon icon={cilSearch} />
                        {' '}Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='danger' onClick={downloadCSV}>
                        <CIcon icon={cilCloudDownload} className="me-2" />
                        Exportar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={12}>
                    <CCol xs={3} md={3}>
                        <br />
                        <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                    </CCol>
                </CCol>
                <CCol>
                    <DataTable
                        columns={colCan}
                        data={fDCancelado}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <br />
        </CContainer>
    </>
    )
}
export default RPCancelados