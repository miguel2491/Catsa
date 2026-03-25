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

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilPen, cilSearch } from '@coreui/icons';
import {getCotizacionId, setUpdFcaVenc} from '../../Utilidades/Funciones'

const CVencimiento = () => {
    const [dtCVenc, setDTCVenc] = useState([])

    const handleInputChange = (e) => {
        setCotVenc(e.target.value); // Actualiza el estado con el nuevo valor del input
    };
    //Constantes Formulario
    const [nCoti, setCotVenc] = useState('');
    const [fcaVen, setFcaVen] = useState('');
    const [shDiv, setShDiv] = useState(false)

    const getVenc = async () =>{
        try {
            const data = await getCotizacionId(nCoti);
            console.log(data);
            if (data) {
                setShDiv(true)
                setDTCVenc(data);
            } else {
                Swal.fire("No se encontraron datos", "El número de cotización no es válido", "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
        } 
    }

    const colVenc = [
         {
            name: 'ACCIONES',
            width:"150px",
            sortable:true,
            cell: (row) => {
                // --- Calcular las fechas ---
                const fechaCreacion = new Date(row.FechaCreacion);
                const hoyMas15 = new Date();
                hoyMas15.setDate(hoyMas15.getDate() + 15);

                // Diferencia en milisegundos
                const diffMs = hoyMas15 - fechaCreacion;

                // Equivalente a 3 meses (≈ 90 días)
                const tresMesesMs = 90 * 24 * 60 * 60 * 1000;

                // true si la creación es más reciente que 3 meses
                const dentroDe3Meses = diffMs <= tresMesesMs;
                // --- Condición para mostrar el botón ---
                const mostrarBoton = dentroDe3Meses;

                return (
                <div>
                    <CRow>
                    {mostrarBoton && (
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            style={{ color: 'white' }}
                            color="primary"
                            onClick={() => updVig(row.IdCotizacion, row.FinVigencia)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilLoopCircular} />
                        </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
                );
            },
        },
        {
        name: 'PLANTA',
        selector: (row) => row.Planta,
        sortable: true,
        width: '120px',
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
            name: 'OBRA',
            selector: (row) => {
                const obra_ = row.Obra
                if (obra_ === null || obra_ === undefined) {
                return 'No disponible'
                }
                if (typeof obra_ === 'object') {
                return '-' // O cualquier mensaje que prefieras
                }
                return obra_
            },
            sortable: true,
            width: '300px',
        },
        {
        name: 'FIN VIGENCIA',
        selector: (row) => {
           var fecha = row.FinVigencia
            if (fecha === null || fecha === undefined) {
            return "No disponible";
            }
            if (typeof fecha === 'object') {
            return "Sin Fecha"; // O cualquier mensaje que prefieras
            }
            const [fecha_, hora_] = fecha.split("T");
            return fecha_
        },
        sortable: true,
        width: '150px',
        },
        {
        name: 'ESTATUS',
        selector: (row) => {
            
            return row.Estatus
        },
        sortable: true,
        width: '100px',
        },
    ];
    
    const updVig = async(idP, fcaV) =>{
        Swal.fire({
            title: "¿Deseas Actualizar la cotización "+idP+" la Fecha de vencimiento por 15 días?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Actualizar",
            denyButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Procesando Solicitud...',
                    didOpen: () => {
                        Swal.showLoading();
                        actualizarFcaV(idP, fcaV);
                    }
                });
            }
        });
    }

    const actualizarFcaV = async (id, fcaV) => {
        const fecha = new Date(fcaV);
        fecha.setDate(fecha.getDate() + 15);
        const fechaV = fecha.toISOString();

        try {
            const result = await setUpdFcaVenc(id, fechaV);

            if (result?.message?.toLowerCase().includes('exitosa')) {
            Swal.fire("Correcto", "Fecha actualizada correctamente", "success");
            setShDiv(false);
            nCoti('');
            } else {
            Swal.fire("Error", "No se pudo actualizar la fecha", "error");
            }

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            Swal.close();
        }
    };

    useEffect(() => {
        
    },);

  return (
    <>
      <CContainer fluid>
        <h1>Cotizaciones por Vencimiento</h1>
        <CRow>
          <CCol sm="auto" className='mt-3'>
            <CFormInput type="text" placeholder="No. Cotización" value={nCoti}  onChange={handleInputChange} />
          </CCol>
          <CCol sm="auto" className='mt-3'>
            <CButton color='primary' onClick={getVenc}>
                <CIcon icon={cilSearch} className="me-2" />
                Realizar
            </CButton>
            </CCol>
        </CRow>
        {shDiv && (
        <CRow className='mt-4'>
            <DataTable
                columns={colVenc}
                data={dtCVenc}
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

export default CVencimiento
