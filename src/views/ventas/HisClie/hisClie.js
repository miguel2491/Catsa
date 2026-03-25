import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import '../../../estilos.css';
import { getCl, getObra, getPlantasList, convertArrayOfObjectsToCSV } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilSearch,cilCloudDownload, cilTrash, cilFile } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"
const currentDate = new Date();
const RPHisCli = () => {
    //************************************************************************************************************************************************************************** */
    const [plantasSelF , setPlantasF] = useState('');
    const [vOC, setVOC] = useState(false);
    // ROLES
    //const userIsJP = Rol('JefePlanta');
    //Arrays
    const [dtCl, setDTCl] = useState([]);
    const [dtObra, setDTObra] = useState([]);
    const [FileDT, setFileCl] = useState([]);
    //Buscador
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    //********************************************************************** GRÁFICAS ******************************************************************************************************** */
    const [dtPlantas, setDTPlantas] = useState([]);
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getPlantas();
        if (plantasSelF) {
            getCl_();
        }
    }, [plantasSelF]);
    //************************************************************************************************************************************************************************************** */
    const getCl_ = () =>{
        setDTCl([]);
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gCl();
            }
        });
    }
    const gCl = async () => {
        try{
            const ocList = await getCl(plantasSelF);
            if(ocList)
            {
                // Actualiza el estado con los nuevos datos
                setDTCl(ocList);
                setFileCl(ocList);
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
    const viewPC = (nc) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Mostrando...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                setVOC(true)
                gObra(nc)
            }
        });
    } 
    const gObra = async (n) => {
        try{
            Swal.close();
            const ocList = await getObra(n);
            if(ocList)
            {
                // Actualiza el estado con los nuevos datos
                setDTObra(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    // Columnas
    const colCli = [
        {
            name: 'Acciones',
            width:"100px",
            sortable:true,
            cell: (row) => (
                <div>
                    <CRow>
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            style={{'color':'white'}}
                            color="primary"
                            onClick={() => viewPC(row.NoCliente)}
                            size="sm"
                            className="me-2"
                            title="Historial"
                        >
                            <CIcon icon={cilFile} />
                        </CButton>
                        </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Planta',
            width:"100px",
            selector: row => row.Planta,
            sortable:true,
        },
        {
            name: 'No. Cliente',
            width:"100px",
            selector: row => row.NoCliente,
            sortable:true,
        },
        {
            name: 'Nombre',
            width:"300px",
            selector: row => row.Nombre,
            sortable:true,
        },
        {
            name: 'Direccion',
            width:"400px",
            selector: row => 
                [row.Calle, row.Colonia, row.CodigoPostal]
            .filter(x => x && x.trim() !== '')
            .join(' ') || '—',
            sortable:true,
        },
        {
            name: 'Telefono',
            width:"150px",
            selector: row => {
                const c = row.Telefono;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable:true,
        },
        {
            name: 'Comentario',
            selector: row => {
                const c = row.Comentario;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable: true,
            width:"500px",
            grow:1,
        },
    ];
    const colObr = [
        {
            name: 'No. Obra',
            width:"150px",
            selector: row => row.NoObra,
            sortable:true,
        },
        {
            name: 'Obra',
            width:"300px",
            selector: row => row.Obra,
            sortable:true,
        },
        {
            name: 'Metros Vendidos',
            width:"150px",
            selector: row => {
                const val = row.Cantidad;
                return (typeof val === 'number' && !isNaN(val)) ? val.toLocaleString() : '—';
            },
            sortable:true,
        },
        {
            name: 'Última Fecha',
            width:"150px",
            selector: row => {
                const fecha = row.UltimaFechaTicket;
                if (!fecha || typeof fecha !== 'string') return '—';
                const d = new Date(fecha);
                return isNaN(d) ? '—' : d.toLocaleDateString();
            },
            sortable:true,
        },
        {
            name: 'Direccion',
            width:"400px",
            selector: row => 
                [row.Direccion]
            .filter(x => x && x.trim() !== '')
            .join(' ') || '—',
            sortable:true,
        },
        {
            name: 'Región',
            width:"150px",
            selector: row => {
                const region = row.Region?.trim() || '';
                return region || '—';
            },
            sortable:true,
        },
        {
            name: 'Vendedor',
            selector: row => {
                const c = row.Vendedor;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable: true,
            width:"500px",
            grow:1,
        },
    ];
    //************************************************************************************************************************************************************************** */
    const mCambio = (event) => {
        const planta = event.target.value;
        setPlantasF(planta);
    };
    // Búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {

    };
    // Descargar CSV
    const downloadCSV = () => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(FileDT);
        if (csv == null) return;
        const filename = 'HistoricoCli_'+plantasSelF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    
    const fDCliente = dtCl.filter(item => {
        return (
            item.Planta.includes(fText) && item.Planta.includes(plantasSelF) || item.Nombre.includes(fText) || item.NoCliente.includes(fText)
        );
    },[dtCl,fText, plantasSelF]);
    //************************************************************************************************************************************************************************************* */
    return (
    <>
        <CContainer fluid>
            <h3>Reporte Historico Clientes </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={3} lg={2}>
                    <label>Planta</label>
                    <CFormSelect aria-label="Selecciona" value={plantasSelF} onChange={mCambio}>
                        <option value="" >Selecciona...</option>
                        <option value="T">Todas</option>
                        {dtPlantas.map((planta, index) =>(
                            <option value={planta.IdPlanta} key={index}>{planta.Planta}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='primary' onClick={getCl_}> 
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
                <CCol xs={12} md={5}>
                    <CCol xs={8} md={8}>
                        <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                    </CCol>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colCli}
                        data={fDCliente}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <br />
            <CModal 
                backdrop="static"
                visible={vOC}
                onClose={() => setVOC(false)}
                className='c-modal-80'
            >
            <CModalHeader>
                <CModalTitle id="oc_" className='tCenter'>Historial Obras</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className='mt-4 mb-4'>
                    <CCol>
                        <DataTable
                        columns={colObr}
                        data={dtObra}
                        pagination
                        persistTableHead
                        subHeader
                    />
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CCol xs={4} md={2}>
                    <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                        <CIcon icon={cilTrash} />   Cerrar
                    </CButton>
                </CCol>
            </CModalFooter>
        </CModal>
        </CContainer>
    </>
    )
}
export default RPHisCli
