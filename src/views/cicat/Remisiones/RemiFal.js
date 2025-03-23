import React, {useEffect, useState} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { getRemFaltante,setRemFaltante,convertArrayOfObjectsToCSV } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormTextarea
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'

const RemiFal = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);      // Modal de "Cargando..."

    // Nuevo: para modal de confirmación de eliminación con comentario
    const [visibleDelConf, setVisibleDelConf] = useState(false);  // Controla la visibilidad del nuevo modal
    const [deleteData, setDeleteData] = useState({});             // Guarda temporalmente Id, Planta
    const [deleteReason, setDeleteReason] = useState('');         // Motivo de la eliminación

    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');

    //Arrays
    const [dtRemisiones, setDTRemisiones] = useState([]);
    const [exRemisiones, setExRemisiones] = useState([]);

    //Buscador
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');

    const opcionesFca = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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
        updatedRemisiones[rowIndex].NoRemision = newVal; 
        setDTRemisiones(updatedRemisiones);
    };

    // Columnas de la tabla
    const colRem = [
        {
            name: 'No. Remisión',
            width:"200px",
            cell: (row, index) => (
                <input
                  type="number"
                  value={row.NoRemision}
                  onChange={(e) => handleEdit(e, index)}
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
                        {/* Botón de eliminar (ahora llama a delRemisionConf para abrir el modal con comentario) */}
                        {userIsOperacion && (
                            <CCol>
                                <CButton
                                    color="danger"
                                    onClick={() => delRemisionConf(row.IdOperacion, row.NoRemision, row.Planta)}
                                    size="sm"
                                    className="me-2"
                                    title="Eliminar"
                                    style={{color:'white'}}
                                >
                                    <CIcon icon={cilTrash} />
                                </CButton>
                            </CCol>
                        )}
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

    // Efecto inicial si se requiere
    useEffect(() => {
        // getRemFal() si gustas que cargue al inicio 
    }, []);

    const getRemFal = async () => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const remF = await getRemFaltante(plantasSel, auxFcaI, auxFcaF);
            Swal.close();

            if (remF && remF.length > 0) {
                const arrAux = [];
                remF.forEach(item=>{
                    arrAux.push({
                        "IDOperacion":item.IdOperacion,
                        "Fecha":item.Fecha,
                        "Cantidad":item.Cantidad,
                        "Material":item.Material
                    });
                })
                setDTRemisiones(remF);
                setExRemisiones(arrAux);
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };

    const updRemision = async (Id, NRem, Planta) => {
        try {
            const remF = await setRemFaltante(Id, NRem, Planta, '1','-');
            Swal.fire("Éxito", "Se Modifico correctamente", "success"); 
            getRemFal();
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar la información", "error");
        }
    };

    /**
     * 1) Abrimos el modal nuevo donde se pide el comentario
     * 2) Guardamos en deleteData el Id y la Planta
     * 3) Mostramos la ventana emergente
     */
    const delRemisionConf = (Id, Nr, Planta) => {
        setDeleteData({ Id, Nr, Planta });
        setDeleteReason('');         // Limpiamos el motivo al abrir
        setVisibleDelConf(true);     // Mostramos el modal
    };

    /**
     * Llamada final para eliminar (después de que el usuario ingresó el motivo y confirma)
     */
    const confirmDelRemision = async() => {
        try {
            const { Id, Nr, Planta } = deleteData;
            // Aquí pasamos deleteReason como cuarto parámetro
            const remF = await setRemFaltante(Id, Nr, Planta, '0', deleteReason);
            Swal.fire("Éxito", remF, "success"); 
            getRemFal();
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar la información", "error");
        } finally {
            // Cerramos el modal de confirmación
            setVisibleDelConf(false);
        }
    };

    // (Si no deseas el Swal de confirmación adicional, lo puedes quitar)
    //-----------------------------------------------------------------------------------

    // Descargar CSV
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
    
    // Búsqueda en tabla
    const onFindBusqueda = (e) => {
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        // Aquí un ejemplo si tienes un array con "Plantas"
        // O en tu caso, la búsqueda se aplica en dtRemisiones
    };

    // Filtrado rápido por texto
    const fDRemision = dtRemisiones.filter(item => {
        return (
            item.Material.toLowerCase().includes(fText.toLowerCase()) ||
            item.Fecha.includes(fText)
        );
    });

    return (
        <>
            <CContainer fluid>
                {/* Modal de Carga (ya existente) */}
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

                {/* Nuevo Modal para Confirmar Eliminación con Motivo */}
                <CModal
                    visible={visibleDelConf}
                    onClose={() => setVisibleDelConf(false)}
                >
                    <CModalHeader>
                        <CModalTitle>Confirmar Eliminación</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>Por favor, indica el motivo de la eliminación:</p>
                        <CFormTextarea
                            rows="3"
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Motivo de la eliminación"
                        />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleDelConf(false)}>
                            Cancelar
                        </CButton>
                        <CButton color="danger" onClick={confirmDelRemision}>
                            Eliminar
                        </CButton>
                    </CModalFooter>
                </CModal>

                <h3>Remisión Faltante </h3>
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
                    <CCol xs={6} md={2} className='mt-3'>
                        <CButton color='primary' onClick={getRemFal}> 
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
                            columns={colRem}
                            data={fDRemision}
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

export default RemiFal;
