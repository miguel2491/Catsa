import React, {useEffect, useState, useRef} from 'react'
import '../../../estilos.css';
import Swal from "sweetalert2";
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { getBitacoraEquipos, getBitacoraId, convertArrayOfObjectsToCSV, fNumber
} from '../../../Utilidades/Funciones';
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CFormSelect,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheck,
  cilEyedropper,
  cilPlus,
  cilSearch,
  cilX,
} from '@coreui/icons'
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { Rol } from '../../../Utilidades/Roles'
import { format } from 'date-fns';

const BitacoraEquipo = () => {    
    //--------------- TABLES --------------------------------
    const [idReg, setIdReg] = useState(0);
    //--------------- MODALS ---------------------------------
    const [mdlConsulta, setMConsulta] = useState(false);
    //------------------Shows---------------------------------
    const [shDiv, setShDiv] = useState(false);
    //--DT Pedidos
    const [dtBitacoraEquipo, setDTBitacoraEquipo] = useState([]);
    //EXTRAS
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    // ROLES
    const userIsAdmin = Rol('Admin');
    useEffect(()=>{    
      btnBuscar();
    },[]);
    //-----------------------------------------------------------------------------------
    
    //---------------------------- BOTONS --------------------------------------------
    const btnBuscar = async() =>{
      Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const bitacora = await getBitacoraEquipos();
            Swal.close();
            if(bitacora)
            {
              setShDiv(true)
              setDTBitacoraEquipo(bitacora);
            }
        } catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }    
    }

    //=================================================================================
    const Eliminar = async(id) =>{
      Swal.fire({
          title: "¿Deseas eliminar el equipo "+id+" ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Eliminar",
          denyButtonText: "Cancelar"
      }).then((result) => {
          if (result.isConfirmed) {
              Swal.fire({
                  title: 'Cargando...',
                  text: 'Procesando Solicitud...',
                  didOpen: () => {
                      Swal.showLoading();
                      eliminarEQ(idP);
                  }
              });
          }
      });
    }
    //--------------------------- COLS -----------------------------------------------
    const colBitacora = [
      {
          name: 'ACCION',
          width:"100px",
          sortable:true,
          cell: (row) => {    
              return (
              <div>
                  <CRow>
                      <CCol xs={3} md={3} lg={3}>
                        <CButton
                            style={{ color: 'white' }}
                            color="primary"
                            onClick={() => setMConsulta(true)}
                            size="sm"
                            className="me-2"
                            title="Consulta"
                        >
                            <CIcon icon={cilEyedropper} />
                        </CButton>
                      </CCol>
                  </CRow>
              </div>
              );
          },
      },
      {
        name: 'FECHA',
        selector: row => {
            const fecha = row.fecha;
            if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
            return fecha_;
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'ÁREA',
        selector: (row) => {
          const aux = row.area
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '120px',
      },
      {
        name: 'EQUIPO',
        selector: row => {
            const aux = row.articulo;
            return aux;
        },
        sortable: true,
        width: '100px',
      },
      {
        name: 'PLANTA',
        selector: (row) => {
          const aux = row.planta
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'TIPO MOVIMIENTO',
        selector: (row) => {
          const aux = row.tipoMov
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'USUARIO',
        selector: (row) => {
          const aux = row.usuario
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'OBSERVACIONES',
        selector: (row) => {
          const aux = row.observaciones
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '400px',
      },
      {
        name: 'COMENTARIO',
        selector: (row) => {
          const aux = row.imei
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '400px',
      },
    ];
    //--------------------------- FUNCTION ACCIONES -----------------------------------------------
    // Función de búsqueda SP
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
      setBPlanta(e.target.value)
      setFText(e.target.value)
    }
    const fBusqueda = () => {
      if (vBPlanta.length != 0) {
        const valFiltrados = dtBitacoraEquipo.filter(
          (dtBitacoraEquipo) => dtBitacoraEquipo.area.includes(vBPlanta) || dtBitacoraEquipo.planta.includes(vBPlanta) || dtBitacoraEquipo.tipoMov.includes(vBPlanta) || dtBitacoraEquipo.usuario.includes(vBPlanta) || dtBitacoraEquipo.articulo.includes(vBPlanta), 
        )
      } else {
        btnBuscar()
      }
    }
    const fBit = dtBitacoraEquipo.filter((item) => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.area.toString().includes(fText) || item.planta.toString().includes(fText) || item.tipoMov.toString().includes(fText) || item.usuario.toString().includes(fText) || item.articulo.toString().includes(fText) 
    })
  
    //************************* HANDLE*************************************************************** */
    const h_articulo = (e) =>{
        setArticulo(e.target.value)
    };
    //******************************************************** */
    // Descargar CSV
    const downloadQR = () => {
        const svgElement = document.getElementById('qr-code-svg'); // Obtener el SVG generado
        const svgData = new XMLSerializer().serializeToString(svgElement); // Serializar el SVG a string
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' }); // Convertir el SVG a Blob
        const svgUrl = URL.createObjectURL(svgBlob); // Crear un objeto URL del Blob

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // Convertir el canvas a imagen PNG
            const pngDataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngDataUrl;
            link.download = 'QR_Code.png'; // Nombre del archivo a descargar
            link.click();
        };
        img.src = svgUrl; // Cargar el SVG como imagen
    };
    //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>BITACORA DE EQUIPOS</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={3} md={3}>
          <CFormSelect className='mt-4' aria-label="size 3 select example">
            <option value="0">Todos</option>
            <option value="C">Celulares</option>
            <option value="L">LapTop</option>
            <option value="P">PC</option>
            <option value="I">Impresoras</option>
            <option value="V">Varios</option>
          </CFormSelect>
        </CCol>
        <CCol xs={5} md={5} className='mt-4'>
            <CButton color='info' style={{color:"white",marginRight:"10px"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
        </CCol>
        <CCol xs={3} md={3}>
            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
          </CCol>        
      </CRow>
      {shDiv && (
          <>
          <CRow className="mt-4 mb-4" id="divTb">
              <DataTable
                columns={colBitacora}
                data={fBit}
                pagination
                persistTableHead
                subHeader
              />
            </CRow>
          </>
      )}
      {/* Modal Nuevo */}
      <CModal
        backdrop="static"
        size="lg"
        visible={mdlConsulta}
        onClose={() => setMConsulta(false)}
      >
        <CModalHeader>
          <CModalTitle>Nuevo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className='mt-2 mb-2'>
            <CCol xs={12} md={4}>
              <label>Categoria</label>
              
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setMConsulta(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
    </>
  )
}

export default BitacoraEquipo
