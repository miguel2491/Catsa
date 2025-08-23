import React, {useEffect, useState} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { getAlmacen,setRemFaltante,convertArrayOfObjectsToCSV, delAlmacen } from '../../../Utilidades/Funciones';
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

const Exceso = () => {
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
    const [dtAlmacen, setDTAlmacen] = useState([]);
    const [dtAlmacenFind, setDTAlmacenFind] = useState([]);

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
    const colAlm = [
        {
            name: 'Acción',
            selector: row => row.IdOperacion,
            width:"100px",
            cell: (row) => (
                <div>
                    <CRow>
                            <CCol>
                                <CButton
                                    color="danger"
                                    onClick={() => delRemisionConf(row.IDOperacion, row.NoReferencia, row.Planta)}
                                    size="sm"
                                    className="me-2"
                                    title="Eliminar"
                                    style={{color:'white'}}
                                >
                                    <CIcon icon={cilTrash} />
                                </CButton>
                            </CCol>
                        
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Planta',
            width:"100px",
            selector:row=>row.Planta,
            with:"100px"
        },
        {
            name: 'No. Referencia',
            selector: row => (row.NoReferencia !== null && row.NoReferencia !== undefined && row.NoReferencia !== '') 
                     ? row.NoReferencia  
                     : 'N/A',
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Operacion',
            selector: row => row.Operacion,
            sortable:true,
            width:"130px",
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
                return fecha_+" "+ hora;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'Fecha Creación',
            selector: row => {
                const fecha = row.FechaCreacion;
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                  }
                  if (typeof fecha === 'object') {
                    return "Sin Fecha";
                  }
                  const [fecha_, hora] = fecha.split("T");
                return fecha_+" "+hora;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad',
            selector: row => row.Cantidad.toFixed(2),
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad Carga',
            selector: row => (row.CantCarga !== null && row.CantCarga !== undefined && row.CantCarga !== '') 
                     ? row.CantCarga 
                     : 'N/A',
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Material',
            selector: row => row.Material,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Unidad',
            selector: row => row.Unidad,
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'IDOperacion',
            selector: row => row.IDOperacion,
            sortable:true,
            width:"300px",
        },
    ];

    useEffect(() => {
        // getRemFal() 
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
            const remF = await getAlmacen(auxFcaI, auxFcaF);
            Swal.close();
            console.log(remF)
            if (remF && remF.length > 0) {
                const arrAux = [];
                remF.forEach(item=>{
                    if(item.Planta == plantasSel){
                        arrAux.push({
                            "Planta":item.Planta,
                            "IDOperacion":item.IdOperacion,
                            "Operacion":item.Operacion,
                            "Fecha":item.Fecha,
                            "FechaCreacion":item.FechaCreacion,
                            "Cantidad":item.Cantidad,
                            "Material":item.Material,
                            "Unidad":item.Unidad,
                            "IdTicket":item.IdTicket,
                            "CantCarga":item.CantCarga,
                            "NoReferencia":item.NoReferencia,
                        });
                    }
                })
                console.log(arrAux)
                setDTAlmacen(remF);
                setDTAlmacenFind(arrAux);
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };

    const delRemisionConf = async(Id, Remision,Planta) => {
        Swal.fire({
            title: "¿Seguro que deseas eliminar ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`
        }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const remF = await delAlmacen(Id, Remision, Planta);
                if (remF) {
                    Swal.fire("Éxito", "Se eliminó correctamente", "success"); 
                } else {
                    Swal.fire("Error", "Se elimino correctamente", "success");
                }
                getRemFal();  
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
    };
    const fBusqueda = () => {

    };

    // Filtrar por texto en Material o Fecha
    const fDRemision = dtAlmacenFind.filter(item => {
        return (
            item.Material.toLowerCase().includes(fText.toLowerCase()) ||
            item.Fecha.includes(fText)
        );
    });

    return (
        <>
            <CContainer fluid>
                
                <h3>Cargas </h3>
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
                            columns={colAlm}
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

export default Exceso;
