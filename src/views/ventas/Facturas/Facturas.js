import React,{useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2'
import 'leaflet/dist/leaflet.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import DataTable from 'react-data-table-component'
import {
  CFormInput,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import BuscadorDT from '../../base/parametros/BuscadorDT'
import FechaI from '../../base/parametros/FechaInicio'
import FechaF from '../../base/parametros/FechaFinal'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilLoopCircular, cilSearch } from '@coreui/icons';
import {getFacturas, setUpdFcaVenc} from '../../../Utilidades/Funciones'
import { format } from 'date-fns';

const Facturas = () => {
    //==================================== Constantes Formulario =======================================
    const [vFechaI, setFechaIni] = useState(null);
    const [vFcaF, setFechaFin] = useState(null);
    const [nFact, setNFact] = useState('');
    const [shDiv, setShDiv] = useState(false);
    const [dtFact, setDTFact] = useState([]);
    // BUSCADOR
    const [fText, setFText] = useState(''); 
    const [vBuscar, setBuscar] = useState('');
    const handleInputChange = (e) => {
        setNFact(e.target.value); 
    };
    //============================================ FECHAS ================================================
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    //========================================== COL ===================================================
    const colFact = [
         {
            name: 'ACCIONES',
            width:"150px",
            sortable:true,
            cell: (row) => {
                return (
                <div>
                    <CRow>
                        <CCol xs={12} md={6} lg={6}>
                            <CButton
                                style={{ color: 'white' }}
                                color="primary"
                                onClick={() => downloadDoc(row.ID, row.Direccion,'PDF')}
                                size="sm"
                                className="me-2"
                                title="PDF"
                            >
                                <CIcon icon={cilCloudDownload} />
                            </CButton>
                        </CCol>
                        <CCol xs={12} md={6} lg={6}>
                            <CButton
                                style={{ color: 'white' }}
                                color="warning"
                                onClick={() => downloadDoc(row.ID, row.Direccion,'XML')}
                                size="sm"
                                className="me-2"
                                title="XML"
                            >
                                <CIcon icon={cilCloudDownload} />
                            </CButton>
                        </CCol>
                    </CRow>
                </div>
                );
            },
        },
        {
            name: 'PLANTA',
            selector: (row) => row.Sucursal,
            sortable: true,
            width: '120px',
        },
        {
            name: 'MOVIMIENTO',
            sortable: true,
            selector: (row) => {
                const vendedor = row.MovID
                if (vendedor === null || vendedor === undefined) {
                    return 'No disponible'
                }
                if (typeof vendedor === 'object') {
                    return '-' // O cualquier mensaje que prefieras
                }
                return vendedor
            },
            width: '200px',
        },
        {
            name: 'CLIENTE',
            sortable: true,
            selector: (row) => {
                const vendedor = row.Cliente
                if (vendedor === null || vendedor === undefined) {
                    return 'No disponible'
                }
                if (typeof vendedor === 'object') {
                    return '-' // O cualquier mensaje que prefieras
                }
                return vendedor
            },
            width: '300px',
        },
        {
            name: 'USUARIO',
            selector: (row) => {
                const obra_ = row.Usuario
                if (obra_ === null || obra_ === undefined) {
                return 'No disponible'
                }
                if (typeof obra_ === 'object') {
                return '-' // O cualquier mensaje que prefieras
                }
                return obra_
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'EMISIÓN',
            selector: (row) => {
            var fecha = row.FechaEmision
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_ +" "+hora_
            },
            sortable: true,
            width: '150px',
        },
    ];
    //========================================= FUNCIONES ==============================================
    const getFacturasList = async () =>{
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFcaF, 'yyyy/MM/dd');
        try {
            const data = await getFacturas(auxFcaI, auxFcaF);
            if (data) {
                setShDiv(true)
                setDTFact(data);
            } else {
                Swal.fire("No se encontraron datos", "El número de cotización no es válido", "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
        } 
    }
    const downloadDoc = async(id, ruta, tipo) =>{
        Swal.fire({
            title: "¿Deseas descargar el documento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Download",
            denyButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Procesando Solicitud...',
                    didOpen: () => {
                        Swal.showLoading();
                        downloadD(id, ruta, tipo);
                    }
                });
            }
        });
    }
    const downloadD = async (id, ruta, tipo) => {
        const valFiltrados = dtFact.filter(data => 
            data.ID === id &&
            data.Direccion.toUpperCase().endsWith(`.${tipo.toUpperCase()}`)
        );
        if (!valFiltrados.length) {
            return;
        }
        const direccion = valFiltrados[0].Direccion;
        // Quitar extensión
        const rutaSinExtension = direccion.replace(/\.[^\\\/]+$/i, "");
        
    };

    //========================================== BUSCAR ===================================================
    const onFindBusqueda = (e) => {
        setBuscar(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {

    };
    const fDFactura = dtFact.filter(item => {
        return (
            item.MovID.includes(fText) 
        );
    },[dtFact]);
    //=====================================================================================================    
    useEffect(() => {
        
    },);

  return (
    <>
      <CContainer fluid>
        <h2>Facturas</h2>
        <CRow>
            <CCol xs={12} md={2}>
                <FechaI 
                    vFechaI={vFechaI} 
                    cFechaI={cFechaI} 
                />
            </CCol>
            <CCol xs={12} md={2}>
                <FechaF 
                    vFcaF={vFcaF} 
                    mFcaF={mFcaF}
                />
            </CCol>
            <CCol sm="auto" className='mt-4'>
                <CButton color='primary' onClick={getFacturasList}>
                    <CIcon icon={cilSearch} className="me-2" />
                    Buscar
                </CButton>
            </CCol>
            <CCol xs={3} md={3}>
                <BuscadorDT value={vBuscar} onChange={onFindBusqueda} onSearch={fBusqueda} />
            </CCol>
        </CRow>
        {shDiv && (
        <CRow className='mt-4'>
            <DataTable
                columns={colFact}
                data={fDFactura}
                pagination
                persistTableHead
                subHeader
              />
        </CRow>
        )}
      </CContainer>
    </>
  )
}

export default Facturas
