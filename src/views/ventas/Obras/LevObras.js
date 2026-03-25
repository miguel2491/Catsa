import React, {useEffect, useState, useRef} from 'react'
import '../../../estilos.css';
import Swal from "sweetalert2";
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { GetClienteObraI, SetRenewObra,convertArrayOfObjectsToCSV} from '../../../Utilidades/Funciones';
import {
  CButton,
  CBadge,
  CContainer,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilLoopCircular,
  cilPlus,
  cilSearch
} from '@coreui/icons'
import { generarPDF } from "./../../utils/CotizacionPDF";

import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import { Rol } from '../../../Utilidades/Roles'

const LevObras = () => {    
    const navigate = useNavigate();
    const [plantasSel , setPlantas] = useState('');
    //--------------- MODALS ---------------------------------
    const [mNCliente, setMNCliente] = useState(false);
    //------------------Shows---------------------------------
    const [shDiv, setShDiv] = useState(false);
    //Cliente
    const[n_cliente, setNClie] = useState("");
    const[n_obra, setNObra] = useState("");
    const[txtNombre, setTxtNombre] = useState("");
    //--DT Clientes
    const [dtClientes, setDTClientes] = useState([]);
    const [dtPendientes, setDTPendientes] = useState([]);
    //EXTRAS
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    // ROLES
    const userIsAdmin = Rol('Admin');
    
    useEffect(() => {
        Pendientes();
    }, []);

    //-----------------------------------------------------------------------------------
    const mCambio = (event) => {
        const pla = event.target.value; 
        setPlantas(pla);
    };
    //---------------------------- BOTONS --------------------------------------------
    const Pendientes = async() =>{
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
          // Llamada a la API
            const oInt = await GetClienteObraI('PUE1','V','CI','2026-01-13','0');
            Swal.close();  // Cerramos el loading
            console.log(oInt); 
            if (oInt) { 
              setDTPendientes(oInt);  
              setShDiv(true);
            } else {
                //Pendientes();
            }
        } catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }    
    }
    const btnBuscar = async() =>{
        setShDiv(true);
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
          // Llamada a la API
            const cotI = await GetClienteObraI(plantasSel,'V','O','0','0');
            Swal.close();  // Cerramos el loading
            if (cotI) {
              setDTClientes(cotI);  // Procesar la respuesta
              setShDiv(true);
            } else {
                Swal.close();
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }    
    }
    const convertObra = async(obra)=>{
      Swal.fire({
          title: 'Cargando...',
          text: 'Actualizando Obras...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
      });
      try {
      // Llamada a la API
        const cotI = await SetRenewObra(obra);
        Swal.close();  // Cerramos el loading
        if (cotI) {
          Pendientes();
        } else {
            Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
        }
      } catch (error) {
        // Cerrar el loading y mostrar el error
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }    
    }
    //--------------------------- COLS -----------------------------------------------
    
    const colObra = [
        {
          name: 'Acciones',
          width:"100px",
          sortable:true,
          cell: (row) => (
              <div>
                  <CRow>
                    { row.EstatusImportacion.trim() !== 'IMPORTADO' && (
                      <CCol xs={6} md={2} lg={2}>
                      <CButton
                          style={{'color':'white'}}
                          color="primary"
                          onClick={() => convertObra(row.Cuenta)}
                          size="sm"
                          className="me-2"
                          title="Liberar"
                      >
                          <CIcon icon={cilLoopCircular} />
                      </CButton>
                      </CCol>
                    )}
                  </CRow>
              </div>
          ),
        },
        {
          name: 'SUCURSAL',
          selector: row => row.Sucursal,
          sortable:true,
          width:"120px",
        },
        {
          name: 'CLIENTE',
          sortable:true,
          selector: row => row.Nombre,
          width:"300px",
        },
        {
            name: 'N. PEDIDO',
            selector: row => {
                const vendedor = row.IdPedido
                if (vendedor === null || vendedor === undefined) {
                return "No disponible";
                }
                if (typeof vendedor === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return vendedor;
            },
            sortable:true,
            width:"150px",
        },{
          name: 'ESTATUS',
          selector: row => {
            const aux = row.EstatusImportacion.trim();
            if (aux === 'IMPORTADO' ) {
                return <CBadge textBgColor='primary'>{aux}</CBadge>;
            }else {
                return <CBadge color='warning' shape='rounded-pill'>{aux}</CBadge>;
            }
            return aux;
          },
          sortable:true,
          width:"120px",
        },
        {
          name: 'FECHA ALTA INTELISIS',
          selector: row => {
            const fecha = row.UltimoCambio;
            if (fecha === null || fecha === undefined) {
              return "No disponible";
            }
            if (typeof fecha === 'object') {
              return "Sin Fecha"; // O cualquier mensaje que prefieras
            }
            const [fecha_, hora_] = fecha.split("T");
            return fecha_+" "+hora_;
          },
          sortable:true,
          width:"200px",
        },
        {
          name: 'FECHA IMPORTACIÓN A PROCATSA',
          selector: row => {
            const fecha = row.FechaImportacion;
            if (fecha === null || fecha === undefined) {
              return "No disponible";
            }
            if (typeof fecha === 'object') {
              return "Sin Fecha"; // O cualquier mensaje que prefieras
            }
            const [fecha_, hora_] = fecha.split("T");
            return fecha_+" "+hora_;
          },
          sortable:true,
          width:"250px",
        },
        {
          name: 'FECHA ALTA PEDIDO',
          selector: row => {
            const fecha = row.FehaCreacion;
            if (fecha === null || fecha === undefined) {
              return "No disponible";
            }
            if (typeof fecha === 'object') {
              return "Sin Fecha"; // O cualquier mensaje que prefieras
            }
            const [fecha_, hora_] = fecha.split("T");
            return fecha_+" "+hora_;
          },
          sortable:true,
          width:"200px",
        },
        {
          name: 'TIEMPO TRANSCURRIDO',
          selector: row => {
            if (!row.UltimoCambio || !row.FehaCreacion) return "No disponible";

            const inicio = new Date(row.UltimoCambio.replace(" ", "T"));
            const fin = new Date(row.FehaCreacion.replace(" ", "T"));

            const diffMs = fin - inicio;
            
            const segundos = Math.floor(diffMs / 1000);
            const dias = Math.floor(segundos / 86400);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);

            return `${dias}d ${horas}h ${minutos % 60}m ${segundos % 60}s`;
          },
          sortable:true,
          width:"200px",
        },
    ];
    //--------------------------------------------------------------------------------
    // Buscador
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtClientes.filter(dtClientes => 
            dtClientes.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTClientes(valFiltrados);
        }else{
            btnBuscar()
        }
    };
    const fObra = dtPendientes.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Nombre.toString().includes(fText);
    });
    //************************* HANDLE*************************************************************** */
    const hn_cli = (e) =>{
        setNClie(e.target.value)
    };
    const hn_obra = (e) =>{
        setNObra(e.target.value)
    };
    //******************************************************** */
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
    //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Obras</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={12} md={4} className='mt-4'>
            <CButton color='info' style={{"color":"white"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
            <CButton color='warning' style={{"color":"white"}} onClick={downloadCSV}>
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exportar
            </CButton>
        </CCol> 
        <CCol xs={12} md={4}>
            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
        </CCol>
      </CRow>
      {shDiv && (
        <>
            <CRow className='mt-4 mb-4' id="divTb">
            <DataTable
                columns={colObra}
                data={fObra}
                pagination
                persistTableHead
                subHeader
            />
            </CRow>
        </>
      )}
    </CContainer>
    </>
  )
}

export default LevObras
