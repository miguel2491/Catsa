import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../../base/parametros/FechaInicio';
import FechaF from '../../../base/parametros/FechaFinal';
import Plantas from '../../../base/parametros/Plantas';
import '../../../../estilos.css';
import BuscadorDT from '../../../base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV } from '../../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilPlus, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../../Utilidades/Roles'

const OCompra = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [vOC, setVOC] = useState(false);
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Arrays
    const [dtRemisiones, setDTRemisiones] = useState([]);
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
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
    const handleEdit = (e, rowIndex) => {
        const newVal = e.target.value;
        const updatedRemisiones = [...dtRemisiones];
        updatedRemisiones[rowIndex].NoRemision = newVal; // Actualiza el valor de la columna 
        setDTRemisiones(updatedRemisiones);
    };
    //Movimientos
    const colRem = [
        {
            name: 'No. Remisión',
            width:"200px",
            cell: (row, index) => (
                <input
                  type="number"
                  value={row.NoRemision}
                  onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
                  style={{ width: '100%', color:'black',background:'#DDF6EB' }}
                />
              ),
        },{
            name: 'Acción',
            selector: row => row.IdOperacion,
            width:"80px",
            cell: (row) => (
                <div>
                    <CRow>
                    <CCol>
                        <CButton
                            color="primary"
                            onClick={() => updRemision(row.IdOperacion, row.NoRemision, row.Planta)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilSave} />
                        </CButton>
                    </CCol>
                    {...(userIsOperacion || !userIsJP
                        ? [
                        <CCol>
                            <CButton
                                color="danger"
                                onClick={() => delRemision(row.IdOperacion, row.Planta)}
                                size="sm"
                                className="me-2"
                                title="Eliminar"
                                style={{color:'white'}}
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                        ]:[])
                    }
                    </CRow>
                </div>
            ),
        },
        {
            name: 'IDOperacion',
            selector: row => row.IdOperacion,
            sortable:true,
            width:"300px",
        },{
            name: 'Fecha',
            selector: row => {
                const fecha = row.Fecha;
                // Verifica si estatus es null, undefined o un objeto
                if (fecha === null || fecha === undefined) {
                  return "No disponible";
                }
                if (typeof fecha === 'object') {
                  return "Sin Fecha"; // O cualquier mensaje que prefieras
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
                const [fecha_, hora] = fecha.split("T");
                return hora;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad',
            selector: row => row.Cantidad.toFixed(2),
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Material',
            selector: row => row.Material,
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Unidad',
            selector: row => row.Unidad,
            width:"180px",
            sortable:true,
            grow:1,
        },
    ];
    //------------
    useEffect(() => {
        //getProductosInt_(null);
    }, []);

    const downloadCSV = (e) => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exRemisiones);
        if (csv == null) return;
    
        const filename = 'Remisiones_Faltantes'+plantasSel+'_'+vFechaI+'_'+vFechaF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        //setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtPlanta.filter(dtPlanta => 
            dtPlanta.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlanta(valFiltrados);
        }else{
            getPlantas_()
        }
    };
    const fDRemision = dtRemisiones.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Material.toLowerCase().includes(fText.toLowerCase()) || item.Fecha.includes(fText);
    });
    //************************************************************************************************************************************************************************** */
    const newOC = () =>{
        setVOC(true)
    }
    //************************************************************************************************************************************************************************** */
return (
    <>
        <CContainer fluid>
            <h3>Orden Compra </h3>
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
                <CCol xs={6} md={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='primary'> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='success' onClick={newOC} style={{'color':'white'}} > 
                        <CIcon icon={cilPlus} />
                            Agregar OC
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
                        
                    </CCol>
                </CCol>
                <CCol>
                    <DataTable
                        columns={colRem}
                        data={fDRemision}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <CModal
                backdrop="static"
                visible={vOC}
                onClose={() => setVOC(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">OC</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={12} md={4}>
                            <label>Número de Orden</label>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Fecha</label>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Comprador</label>
                        </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={12} md={4}>
                            <label>Dirección</label>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Teléfono</label>
                        </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={12} md={4}>
                            <label>Proveedor</label>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Dirección</label>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Teléfono</label>
                        </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>

                    </CRow>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={12} md={4}>
                            <label>Condiciones de Pago</label>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Condiciones de Entrega</label>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={newOC} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} />    Guardar
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <br />
        </CContainer>
    </>
    )
}
export default OCompra