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

const Obras = () => {    
    const navigate = useNavigate();
    const [plantasSel , setPlantas] = useState('');
    const [posts, setPosts] = useState([]);
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
    const [dtNCliente, setDTNCliente] = useState([]);
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    // ROLES
    const userIsAdmin = Rol('Admin');
    useEffect(()=>{    
      Pendientes();  
      if(plantasSel.length > 0)
        {
            Pendientes();
        }
    },[]);
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
            const oInt = await GetClienteObraI('PUE1','V','OI','0','0');
            Swal.close();  // Cerramos el loading
            if (oInt) {
              setDTPendientes(oInt);  // Procesar la respuesta
              setShDiv(true);
            } else {
                Pendientes();
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
    const getCliente = async() =>{
        try{
            if(plantasSel.length > 0){
                const cotC = await GetClienteObraI(plantasSel,'I','C',n_cliente,n_obra);
                if(cotC.length > 0){
                    setTxtNombre(cotC[0].Nombre);
                }
            }else{
                Swal.fire("Error", "Debes Seleccionar Planta", "error");
            }
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const migrarCliente = async() =>{
        Swal.fire({
            title: 'Actualizando...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            const ocList = await GetClienteObraI(plantasSel, 'A','C',n_cliente, n_obra);
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Agrego Correctamente", "success");
            setMNCliente(false);
            btnBuscar();
        }catch(error){
            console.log(error)
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
    const colClie = [
        {
        name: 'PLANTA',
        selector: row => row.Planta,
        sortable:true,
        width:"120px",
        },
        {
        name: 'No. CLIENTE',
        sortable:true,
        selector: row => row.NoCliente,
        width:"150px",
        },
        {
        name: 'RFC',
        selector: row => row.RFC,
        sortable:true,
        width:"150px",
        },{
        name: 'NOMBRE',
        selector: row => {
            const vendedor = row.Nombre
            if (vendedor === null || vendedor === undefined) {
            return "No disponible";
            }
            if (typeof vendedor === 'object') {
            return "-"; // O cualquier mensaje que prefieras
            }
            return vendedor;
        },
        sortable:true,
        width:"500px",
        },{
        name: 'CALLE',
        selector: row => {
            var ncliente = row.Calle
            if (ncliente === null || ncliente === undefined) {
            ncliente =  "-";
            }
            if (typeof ncliente === 'object') {
            ncliente = "-"; // O cualquier mensaje que prefieras
            }
            var nombreCliente = row.Cliente
            if (nombreCliente === null || nombreCliente === undefined) {
            nombreCliente = "-";
            }
            if (typeof nombreCliente === 'object') {
            nombreCliente = "-"; // O cualquier mensaje que prefieras
            }
            return ncliente+" "+nombreCliente;
        },
        sortable:true,
        width:"300px",
        },{
            name: 'NÚMERO',
            selector: row => {
                var numero = row.Numero
                if (numero === null || numero === undefined) {
                numero = "No disponible";
                }
                return numero;
            },
            sortable:true,
            width:"120px",
        },
        {
        name: 'COLONIA',
        selector: row => {
            var Direccion = row.Colonia
            if (Direccion === null || Direccion === undefined) {
                Direccion = "-";
            }
            if (typeof Direccion === 'object') {
                Direccion = "-"; // O cualquier mensaje que prefieras
            }
            return Direccion;
        },
        sortable:true,
        width:"200px",
        },
        {
        name: 'MUNICIPIO',
        selector: row => {
            var ncliente = row.Municipio
            if (ncliente === null || ncliente === undefined) {
                ncliente =  "-";
            }
            if (typeof ncliente === 'object') {
                ncliente = "-"; // O cualquier mensaje que prefieras
            }
            return ncliente;
        },
        sortable:true,
        width:"200px",
        },
        {
        name: 'ESTADO',
        selector: row => {
            const edo = row.Estado;
            if (edo === null || edo === undefined) {
            return "No disponible";
            }
            if (typeof edo === 'object') {
            return "Sin Estado"; // O cualquier mensaje que prefieras
            }
            return edo;
        },
        sortable:true,
        width:"100px",
        },    
        {
        name: 'CÓDIGO POSTAL',
        selector: row => {
            const actualizo = row.CodigoPostal
            if (actualizo === null || actualizo === undefined) {
                return "No disponible";
            }
            if (typeof actualizo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
            }
            return actualizo;
        },
        sortable:true,
        width:"200px",
        },
        {
        name: 'TELÉFONO',
        selector: row => {
            const actualizo = row.Telefono
            if (actualizo === null || actualizo === undefined) {
                return "No disponible";
            }
            if (typeof actualizo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
            }
            return actualizo;
        },
        sortable:true,
        width:"200px",
        },
        {
        name: 'TELÉFONO 2',
        selector: row => {
            const autorizo = row.Telefono2
            if (autorizo === null || autorizo === undefined) {
            return "No disponible";
            }
            if (typeof autorizo === 'object') {
            return "-"; // O cualquier mensaje que prefieras
            }
            return autorizo;
        },
        sortable:true,
        width:"200px",
        },
        {
        name: 'COMENTARIO',
        selector: row => {
            const autorizo = row.Comentario
            if (autorizo === null || autorizo === undefined) {
            return "No disponible";
            }
            if (typeof autorizo === 'object') {
            return "-"; // O cualquier mensaje que prefieras
            }
            return autorizo;
        },
        sortable:true,
        width:"300px",
        },
    ];
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
          name: 'OBRA',
          sortable:true,
          selector: row => row.Cuenta,
          width:"150px",
        },
        {
        name: 'CLIENTE',
        selector: row => {
            const vendedor = row.Tipo
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
          width:"150px",
        },
        {
          name: 'FECHA IMPORTACIÓN',
          selector: row => {
            const fecha = row.FechaImportacion;
            if (fecha === null || fecha === undefined) {
              return "No disponible";
            }
            if (typeof fecha === 'object') {
              return "Sin Fecha"; // O cualquier mensaje que prefieras
            }
            const [fecha_, hora_] = fecha.split("T");
            return fecha_;
          },
          sortable:true,
          width:"200px",
        },
        {
          name: 'HORA IMPORTACIÓN',
          selector: row => {
            const fecha = row.FechaImportacion;
            if (fecha === null || fecha === undefined) {
              return "No disponible";
            }
            if (typeof fecha === 'object') {
              return "Sin Fecha"; // O cualquier mensaje que prefieras
            }
            const [fecha_, hora_] = fecha.split("T");
            return hora_;
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
    const fCliente = dtClientes.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.NoCliente.toString().includes(fText) || item.Nombre.toString().includes(fText);
    });
    const fObra = dtPendientes.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Cuenta.toString().includes(fText);
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
        <CCol xs={12} md={3}>
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol xs={12} md={4} className='mt-4'>
            <CButton color='info' style={{"color":"white"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
            <CButton color='warning' style={{"color":"white"}} onClick={downloadCSV}>
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exportar
            </CButton>
            <CButton color='primary' onClick={() => setMNCliente(true)}> 
                <CIcon icon={cilPlus} />
                {' '}New
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
        <CRow className='mt-4 mb-4' id="divTb">
            <DataTable
              columns={colClie}
              data={fCliente}
              pagination
              persistTableHead
              subHeader
            />
          </CRow>
        </>
      )}
       {/* Modal Nuevo Cliente */}
          <CModal
            backdrop="static"
            visible={mNCliente}
            onClose={() => setMNCliente(false)}
          >
          <CModalHeader>
            <CModalTitle>Nuevo Cliente</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className='mt-2 mb-2'>
              <CCol xs={12} md={6}>
                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="No. Cliente"
                  placeholder="0"
                  value={n_cliente}
                  onChange={hn_cli}
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="No. Obra"
                  placeholder="---"
                  value={n_obra}
                  onChange={hn_obra}
                />
              </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={3}>
                    <CButton color='primary' onClick={getCliente}> 
                    <CIcon icon={cilSearch} />
                    {' '}Buscar
                    </CButton>
                </CCol>  
            </CRow>
            <CRow className='mt-2 mb-2'>
              <CCol xs={12} md={6}>
                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Planta"
                  placeholder="-"
                  value={plantasSel}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="No. Cliente"
                  placeholder="0"
                  value={n_cliente}
                  disabled
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} md={12}>
                <CFormInput
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel="Nombre"
                  placeholder="0"
                  value={txtNombre}
                  disabled
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={migrarCliente}>
              Migrar
            </CButton>
            <CButton color="secondary" onClick={() => setMNCliente(false)}>
              Cerrar
            </CButton>
          </CModalFooter>
          </CModal>
    </CContainer>
    </>
  )
}

export default Obras
