import React, {useEffect, useState} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import FechaI from '../base/parametros/FechaInicio';
import FechaF from '../base/parametros/FechaFinal';
import Plantas from '../base/parametros/Plantas';
import '../../estilos.css';
import BuscadorDT from '../base/parametros/BuscadorDT'
import { GetOPDuplicados, GetListOPDuplicados,convertArrayOfObjectsToCSV} from '../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CTab,
    CTabContent,
    CTabList,
    CTabPanel,
    CTabs,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../Utilidades/Roles'

const OPDuplicados = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    
    // Nuevo: modal de confirmación de eliminación con comentario
    const [deleteData, setDeleteData] = useState({});    
    const [deleteReason, setDeleteReason] = useState('');

    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    const userIsDos = Rol('userIsDosif');

    //Arrays
    const [dtOProduccion, setDTProduccion] = useState([]);
    const [dtOProduccionList, setDTProduccionList] = useState([]);

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
    const sucursalesMap = {
        "1002": "GDL1",
        "1005": "PUE1",
        "1008": "TLX1",
        "1006": "MEX1",
    };
    // Columnas de la tabla
    const colOP = [
        {
            name: 'Acción',
            selector: row => row.IdOperacion,
            width:"100px",
            cell: (row) => (
                <div>
                    <CRow>
                        {row.Estatus != 'CANCELADO' && (
                        <CCol>
                            <CButton
                                color="danger"
                                onClick={() => delCanOP(row.ID)}
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
            name: 'ID',
            selector: row => {
                const val = row.ID;
                if (
                    val !== null &&
                    val !== undefined &&
                    Number.isInteger(Number(val))
                ) {
                    return Number(val);
                }

                return "N/A";

            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Mov',
            selector: row => row.Mov || '',
            sortable:true,
            width:"150px",
        },
        {
            name: 'Estatus',
            selector: row => row.Estatus || '',
            sortable:true,
            width:"150px",
        },
        {
            name: 'Fecha Emisión',
            selector: row => {
                const fecha = row.FechaEmision;
                if (fecha === null || fecha === undefined) {
                  return "No disponible";
                }
                if (typeof fecha === 'object') {
                  return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
                return fecha_+" "+ hora;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'Referencia',
            selector: row => row.Referencia || '',
            width:"300px",
            sortable:true,
            grow:1,
        },
        {
            name: 'No. Remisión',
            selector: row => {
                const val = row.Observaciones;
                if (typeof val === "string" && val.trim() !== "") {
                    const index = val.indexOf("No.");
                    if (index !== -1) {
                        return val.substring(index).trim();
                    }
                    return val; // si no encuentra "No.", regresa todo
                }
                return "N/A";
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Planta',
            selector: row => sucursalesMap[row.Sucursal] || row.Sucursal || '',
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Usuario',
            selector: row => row.Usuario || '',
            width:"100px",
            sortable:true,
            grow:1,
        },
    ];
     // Estilos condicionales para filas
    const rowStyles = [
        {
            // Aplica color verde si hay un valor numérico válido
            when: row => row.Estatus !== 'CANCELADO',
            style: {
            backgroundColor: '#4EF092',
            color: '#000000',
            },
        },
        {
            // Aplica color rojo si está vacío, nulo o no válido
            when: row => row.Estatus === 'CANCELADO' || row.Estatus === undefined || row.Estatus === '' || typeof row.Estatus === 'object',
            style: {
            backgroundColor: '#CC392E',
            color: '#FFFFFF',
            },
        },
    ];
    const colOPRep = [
        {
            name: 'Fecha Emisión',
            selector: row => {
                const fecha = row.FechaEmision;
                if (fecha === null || fecha === undefined) {
                  return "No disponible";
                }
                if (typeof fecha === 'object') {
                  return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
                return fecha_+" "+ hora;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'Referencia',
            selector: row => row.Referencia || '',
            width:"300px",
            sortable:true,
            grow:1,
        },
        {
            name: 'No. Remisión',
            selector: row => {
                const val = row.Observaciones;
                if (typeof val === "string" && val.trim() !== "") {
                    const index = val.indexOf("No.");
                    if (index !== -1) {
                        return val.substring(index).trim();
                    }
                    return val; // si no encuentra "No.", regresa todo
                }
                return "N/A";
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Repeticiones',
            selector: row => row.VecesDuplicada || '',
            width:"200px",
            sortable:true,
            grow:1,
        },
    ];
    useEffect(() => {
        // getRemFal() 
    }, []);

    const getOPList_ = async () => {
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
            const OPList = await GetListOPDuplicados(auxFcaI, auxFcaF);
            const OPRep = await GetOPDuplicados(auxFcaI, auxFcaF);
            Swal.close();
            setDTProduccionList(Array.isArray(OPList) ? OPList : []);
            setDTProduccion(Array.isArray(OPRep) ? OPRep : [])
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };

    const delCanOP = async(Id) => {
        Swal.fire({
            title: "¿Seguro que deseas cancelar ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Cancelar",
            denyButtonText: `Cancelar`
        }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                // const remF = await delAlmacen(Id);
                // if (remF) {
                //     Swal.fire("Éxito", "Se eliminó correctamente", "success"); 
                // } else {
                //     Swal.fire("Error", "Se elimino correctamente", "success");
                // }
                getOPList_();  
                Swal.fire("Eliminado", "", "success");
            } else if (result.isDenied) {
                Swal.fire("Se cancelo correctamente", "", "info");
            }
        });
    };

    const confirmDelRemision = async() => {
        try {
            const { Id, Planta } = deleteData;
            // Aquí pasamos deleteReason como cuarto parámetro
            const remF = await setRemFaltante(Id, '0', plantasSel,'0', deleteReason);
            if (remF) {
                Swal.fire("Éxito", "Se eliminó correctamente", "success"); 
            } else {
                Swal.fire("Error", "Se elimino correctamente", "success");
            }
            getRemFal();
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar la información", "error");
        } finally {
            setVisibleDelConf(false);
        }
    };

    // Descargar CSV
    const downloadCSV = () => {
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
    
    // Búsqueda
    const onFindBusqueda = (e) => {
        setFText(e.target.value);
        setBPlanta(e.target.value);
    };

    const fBusqueda = () => {

    };

    // Filtrar por texto en Material o Fecha
    const fDProduccionList = dtOProduccionList.filter(item => {
        const mat = (item.Observaciones || "").toLowerCase();
        const ref = String(item.Estatus || "").toLowerCase();
        const search = fText.toLowerCase();

        return (
            mat.includes(search) ||
            ref.includes(search)
        );
    });
    const fDProduccionRep = dtOProduccion.filter(item => {
        const ref = String(item.Estatus || "").toLowerCase();
        const search = fText.toLowerCase();

        return (
            ref.includes(search)
        );
    });

    return (
        <>
            <CContainer fluid>
                <h3>Orden Producción </h3>
                <CRow className='mt-2'>
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
                    <CCol xs={6} md={2} className='mt-4'>
                        <CButton color='primary' onClick={getOPList_}> 
                            <CIcon icon={cilSearch} />
                            {' '}Buscar
                        </CButton>
                    </CCol>
                    <CCol xs={6} md={2} className='mt-4'>
                        <CButton color='danger' onClick={downloadCSV}>
                            <CIcon icon={cilCloudDownload} className="me-2" />
                            Exportar
                        </CButton>
                    </CCol>
                </CRow>
                <CRow>
                    <CTabs activeItemKey="OP">
                        <CTabList variant='tabs' layout='justified'>
                            <CTab itemKey='OP'>Ordenes Producción</CTab>
                            <CTab itemKey='OPALL'>Duplicados</CTab>
                        </CTabList>
                        <CTabContent>
                            <CTabPanel itemKey="OP">
                                <CCol xs={12} md={12}>
                                    <CCol xs={3} md={3}>
                                        <br />
                                        <BuscadorDT value={fText} onChange={onFindBusqueda} />
                                    </CCol>
                                </CCol>
                                <CCol>
                                    <DataTable
                                        columns={colOP}
                                        data={fDProduccionList}
                                        pagination
                                        persistTableHead
                                        subHeader
                                        conditionalRowStyles={rowStyles}
                                    />
                                </CCol>
                            </CTabPanel>
                            <CTabPanel itemKey="OPALL">
                                <CCol xs={12} md={12}>
                                    <CCol xs={3} md={3}>
                                        <br />
                                        <BuscadorDT value={fText} onChange={onFindBusqueda} />
                                    </CCol>
                                </CCol>
                                <CCol>
                                    <DataTable
                                        columns={colOPRep}
                                        data={fDProduccionRep}
                                        pagination
                                        persistTableHead
                                        subHeader
                                    />
                                </CCol>
                            </CTabPanel>                 
                        </CTabContent>
                    </CTabs>       
                </CRow>
                <br />
            </CContainer>
        </>
    )
}

export default OPDuplicados;
