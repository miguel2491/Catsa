import React, {useEffect, useState, useRef} from 'react'
import '../../estilos.css';
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { GetCotizaciones,convertArrayOfObjectsToCSV, setVisitas, getCotizacionById, getPrecios, getCotizacionDIById,
  setCotizaCantCot
 } from '../../Utilidades/Funciones';
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab,
  CFormSelect,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheck,
  cilClearAll,
  cilCloudDownload,
  cilDataTransferDown,
  cilEyedropper,
  cilFile,
  cilGraph,
  cilImage,
  cilMap,
  cilMenu,
  cilPencil,
  cilPhone,
  cilPin,
  cilPlus,
  cilSearch,
  cilShareAlt,
  cilTag,
  cilTransfer,
  cilTrash
} from '@coreui/icons'
import { generarPDF } from "./../utils/CotizacionPDF";

import BuscadorDT from '../base/parametros/BuscadorDT'
//import TabulatorTest from '../base/tables/Tabulator'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import { Rol } from '../../Utilidades/Roles'
import { jsPDF } from "jspdf";

const LCotizacion = () => {    
  const navigate = useNavigate();
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  //--------------- MODALS ---------------------------------
  const [mCotizaciones, setMCotizaciones] = useState(false);
  const [mDetalleItem, setMDetalleItem] = useState(false);
  //------------------Shows---------------------------------
  const [shDiv, setShDiv] = useState(false);
  //Checkeds
  const[sTF, setTF] = useState("C");
  //Cotizacion
  const[noCotSel, setNoCotSel] = useState(0);
  const[codClie, setCodClie] = useState("-");
  const[cliente, setCliente] = useState("-");
  const[codObra, setCodObra] = useState("-");
  const[Obra, setObra] = useState("-");
  const[vendedor, setVendedor] = useState("-");
  const[asesor, setAsesor] = useState([]);
  const[codVendedor, setCodVendedor] = useState("-");
  const[observaciones, setObservaciones] = useState("-");
  const[concom, setConCom] = useState(false);
  const[total, setTotal] = useState(false);
  const[IVA, setIVA] = useState(false);
  const[chkObs, setChkObs] = useState(false);
  const[estatus, setEstatus] = useState(['Aceptada','Cancelada','Negociando','Pendiente','Perdida','Prospecto']);
  const[sEstatus, setsEstatus] = useState("");
  //--DT DETALLE
  const [dtCotizacionD, setDTCotizacionD] = useState([]);
  //EXTRAS
  const [dtExtras, setDTExtras] = useState([]);
  const [txtIdExtra, setIdExtra] = useState(0);
  const [txtExtra, setExtra] = useState('');
  const [txtCant, setCant] = useState(0.0);
  const [txtCantCot, setCantCot] = useState(0.0);
  const [txtPrecio, setPrecio] = useState(0.0);
  const [txtPrecioUser, setPrecioUser] = useState(0.0);
  const [txtPrecioTot, setPrecioTotal] = useState(0.0);
  //SEGUIMIENTO
  const [dtListSeg, setDTListSeg] = useState([]);
  const [hora, setHora] = useState(new Date());

  //CLIENTE
  const[direccion, setDireccion] = useState("-");
  //OBRA

  //LOG MOD
  const [dtMod, setDTMod] = useState([]);
  //Arrays
  const [dtCotizacion, setDTCotizacion] = useState([]);
  
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };

  // Almacena los puntos de las visitas
  // Modal para mostrar el mapa
  const handleExtraActions = (idCotizacion) => {
    setSelectedCotizacion(idCotizacion)
    setMAcciones(true)
  }
  //------------ FROMS CLIENTE/OBRAS ------------------------------------------
  const [RazonTxtC, setRazonC] = useState('');
  const [RFCTxtC, setRFCC] = useState('');
  //--------------------------- Buscador --------------------------------------
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('');
  // ROLES
  const userIsAdmin = Rol('Admin');
  useEffect(()=>{    
    if(vFechaI!=null){
      if(plantasSel.length >0 && vFechaI.length > 0 && vFcaF.length > 0)
        {
          GetCotizaciones_();
        }
    }
  },[]);
  //-----------------------------------------------------------------------------------
  const mCambio = (event) => {
    const pla = event.target.value; 
    setPlantas(pla);
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  const irNuevo = ()=>{
    navigate('/ventas/Cotizador/0')
  }
  //---------------------------- BOTONS --------------------------------------------
  const btnBuscar = () =>{
    setShDiv(true);
    if(plantasSel.length > 0)
    {
      if(posts.length>0){
        const filteredCotizaciones = posts.filter(item => item.IdPlanta === plantasSel);
        setDTCotizacion(filteredCotizaciones);
      }else{
        GetCotizaciones_(plantasSel);
      }
    }else{
      if(posts.length>0){
        setDTCotizacion(posts);
      }
    }
  }
  const seguimiento = async(id) =>{
    setMCotizaciones(true);
    setNoCotSel(id);
    try{
      const ocList = await getCotizacionById(id);
      if(ocList){
        const objC = ocList[0][0];
        const objD = ocList[1];
        const objS = ocList[3];
        const objM = ocList[4];
        const objE = ocList[5];
        const objV = ocList[6];
        if(objV){
          setAsesor(objV);
        }
        if(objC){
          setDireccion(
            objC.Direccion && Object.keys(objC.Direccion).length > 0
              ? objC.Direccion
              : "-"
          );
          setCodClie(
            objC.NoCliente && Object.keys(objC.NoCliente).length > 0
              ? objC.NoCliente
              : "SIN CÓDIGO"
          );
          setCliente(
            objC.Cliente && Object.keys(objC.Cliente).length > 0
              ? objC.Cliente
              : "SIN CLIENTE"
          );
          setCodObra(
            objC.NoObra && Object.keys(objC.NoObra).length > 0
              ? objC.NoObra
              : "SIN CÓDIGO"
          );
          setObra(
            objC.Obra && Object.keys(objC.Obra).length > 0
              ? objC.Obra
              : "SIN OBRA"
          );
          setVendedor(
            objC.IdVendedor && Object.keys(objC.IdVendedor).length > 0
              ? objC.IdVendedor
              : "-"
          );
          setConCom(
            objC.FlagCondiciones
              ? true
              : false
          );
          setTotal(
            objC.FlagTotal
              ? true
              : false
          );
          setIVA(
            objC.FlagIVA
              ? true
              : false
          );
          setChkObs(
            objC.FlagObservaciones
              ? true
              : false
          );
          setsEstatus(
            objC.Estatus
            ? objC.Estatus
            :""
          );
          setCodVendedor(objC.IdVendedor ? objC.IdVendedor:"");
        }
        if(objD){
          setDTCotizacionD(objD);
        }
        if(objM){
          setDTMod(objM);
        }
        if(objE){
          setDTExtras(objE)
        }
      }
    }catch(error){
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const download_file = (id) =>{
    console.log('⚓'+id)
  }
  const eliminar = (id) =>{
    console.log('🔥'+id)
  }
  const detalleItem = async(id) => {
    setMDetalleItem(true);
    setNoCotSel(id);
    try{
      const ocList = await getCotizacionDIById(id);
      if(ocList){
        ocList.forEach((item, index) => {
            if(item.IdExtra == 156)
            {
              setIdExtra(item.IdExtra);
              setExtra(item.Extra);
              setCant(item.CantUsr);
              setCantCot(item.Cantidad);
              setPrecio(item.Precio);
              setPrecioUser(item.Precio);
              const ptotal = item.Cantidad * item.Precio;
              setPrecioTotal(ptotal);
            }
        })
      }
    }catch(error){
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const setUpdPreCot = async() =>{
    Swal.fire({
        title: 'Actualizando...',
        text: 'Estamos guardando la información...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    try{
      const formData = {
        cE:{
          IdCotizacion: noCotSel,
          IdExtra:txtIdExtra,
          Cantidad: txtCant
        }
      };
      const ocList = await setCotizaCantCot(formData);
      console.log('☠️',ocList)
      Swal.close();  // Cerramos el loading
      Swal.fire("Éxito", "Se Modifico Correctamente", "success");
      setMDetalleItem(false);
    }catch(error){
      console.log(error)
    }
  }
  //--------------------------- COLS -----------------------------------------------
  const colCot = [
    {
          name: 'Acciones',
          selector: row => row.id,
          width:"200px",
          cell: (row) => (
              <div>
                  <CRow>
                    <CCol xs={3} md={3} lg={3}>
                        <CButton
                            color="warning"
                            onClick={() => seguimiento(row.IdCotizacion)}
                            size="sm"
                            className="me-2"
                            title="Seguimiento"
                        >
                        <CIcon icon={cilGraph} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={3} md={3} lg={3}>
                        <CButton
                            color="primary"
                            onClick={() => generarPDF(row.IdCotizacion)}
                            size="sm"
                            className="me-2"
                            title="Descargar"
                        >
                            <CIcon icon={cilDataTransferDown} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={3} md={3} lg={3}>
                        <CButton
                            color="danger"
                            onClick={() => eliminar(row.IdCotizacion)}
                            size="sm"
                            className="me-2"
                            title="Eliminar"
                        >
                            <CIcon icon={cilTrash} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={3} md={3} lg={3}>
                        <CButton
                            color="primary"
                            onClick={() => transfPedido(row.IdCotizacion)}
                            size="sm"
                            className="me-2"
                            title="Convertir Pedido"
                        >
                            <CIcon icon={cilTransfer} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    {userIsAdmin &&(
                      <CCol xs={3} md={3} lg={3}>
                        <CButton
                            color="info"
                            onClick={() => detalleItem(row.IdCotizacion)}
                            size="sm"
                            className="me-2"
                            title="Detalle ITEM"
                        >
                            <CIcon icon={cilFile} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    )}
                  </CRow>
              </div>
          ),
    },{
      name: 'Planta',
      selector: row => row.Planta,
      sortable:true,
      width:"120px",
    },
    {
      name: 'No. Cotización',
      sortable:true,
      cell: (row) => (
        <button
        className="text-blue-600 underline hover:text-blue-800"
        onClick={() => handleOpenModal(row)}
        >
        {row.IdCotizacion}
        </button>
    ),
      width:"120px",
    },
    {
      name: 'Estatus',
      selector: row => row.Estatus,
      sortable:true,
      width:"200px",
    },{
      name: 'Vendedor',
      selector: row => {
        const vendedor = row.Vendedor
        if (vendedor === null || vendedor === undefined) {
          return "No disponible";
        }
        if (typeof vendedor === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return vendedor;
      },
      sortable:true,
      width:"200px",
    },{
      name: 'Cliente',
      selector: row => {
        var ncliente = row.NoCliente
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
      width:"200px",
    },{
      name: 'Obra',
      selector: row => {
        var nobra = row.NoObra
        if (nobra === null || nobra === undefined) {
          nobra = "No disponible";
        }
        if (typeof nobra === 'object') {
          nobra = "Sin Datos"; // O cualquier mensaje que prefieras
        }
        var obra = row.Obra
        if (obra === null || obra === undefined) {
          obra = "-";
        }
        if (typeof obra === 'object') {
          obra = "-"; // O cualquier mensaje que prefieras
        }
        return nobra+" "+obra;
      },
      sortable:true,
      width:"200px",
    },
    {
      name: 'Dirección',
      selector: row => {
        var Direccion = row.Direccion
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
      name: 'Contacto',
      selector: row => {
        var ncliente = row.NoCliente
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
      width:"200px",
    },
    {
      name: 'Fin Vigencia',
      selector: row => {
        const fecha = row.FinVigencia;
        if (fecha === null || fecha === undefined) {
          return "No disponible";
        }
        if (typeof fecha === 'object') {
          return "Sin Fecha"; // O cualquier mensaje que prefieras
        }
        const [fechaR, hora] = fecha.split("T");
        return fechaR;
      },
      sortable:true,
      width:"150px",
    },    
    {
      name: 'Creo',
      selector: row => {
        const actualizo = row.Creo
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
      name: 'Actualizo',
      selector: row => {
        const actualizo = row.Actualizo
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
      name: 'Motivo',
      selector: row => {
        const autorizo = row.Motivo
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
      name: 'Observaciones',
      selector: row => {
        const autorizo = row.Observaciones
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
  ];
  const colCotMod = [
    {
      name: 'Acciones',
      selector: row => row.id,
      width:"220px",
      cell: (row) => (
          <div>
              <CRow>
                <CCol xs={6} md={6} lg={6}>
                  <CFormCheck inline id="chkVoBo" label="VoBo" checked={row.FlagVoBo === true} onChange={(e)=>{console.log(e.target)}} />
                </CCol>
                <CCol xs={6} md={6} lg={6}>
                    <CFormCheck inline id="chkPrint" label="Print" checked={row.FlagImprimir === true} onChange={(e)=>{console.log(e.target)}} />
                </CCol>
              </CRow>
          </div>
      ),
    },{
      name: 'M3',
      selector: row => row.Cantidad,
      sortable:true,
      width:"100px",
    },
    {
      name: 'Producto',
      sortable:true,
      selector: row => {
        const producto = row.Producto
        if (producto === null || producto === undefined) {
          return "No disponible";
        }
        if (typeof producto === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return producto;
      },
      width:"130px",
    },
    {
      name: '%',
      selector: row => {
        const porcentaje = row.MOP
        if (porcentaje === null || porcentaje === undefined) {
          return "No disponible";
        }
        if (typeof porcentaje === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return porcentaje;
      },
      sortable:true,
      width:"100px",
    },{
      name: 'MB',
      selector: row => {
        const MB = row.MB
        if (MB === null || MB === undefined) {
          return "No disponible";
        }
        if (typeof MB === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return MB;
      },
      sortable:true,
      width:"100px",
    },{
      name: 'Precio Unitario',
      selector: row => {
        var punitario = row.Precio
        if (punitario === null || punitario === undefined) {
          punitario =  "-";
        }
        if (typeof punitario === 'object') {
          punitario = "-"; // O cualquier mensaje que prefieras
        }
        
        return punitario;
      },
      sortable:true,
      width:"180px",
    },{
      name: 'Precio Total',
      selector: row => {
        var pTotal = row.Total
        if (pTotal === null || pTotal === undefined) {
          pTotal = "No disponible";
        }
        if (typeof pTotal === 'object') {
          pTotal = "Sin Datos"; // O cualquier mensaje que prefieras
        }
        return pTotal;
      },
      sortable:true,
      width:"180px",
    },
    {
      name: 'M3Bomba',
      selector: row => {
        var M3Bomba = row.M3Bomba
        if (M3Bomba === null || M3Bomba === undefined) {
          M3Bomba = "-";
        }
        if (typeof M3Bomba === 'object') {
          M3Bomba = "-"; // O cualquier mensaje que prefieras
        }
        return M3Bomba;
      },
      sortable:true,
      width:"140px",
    },
    {
      name: 'Precio Bomba',
      selector: row => {
        var Bomba = row.Bomba
        if (Bomba === null || Bomba === undefined) {
          Bomba =  "-";
        }
        if (typeof Bomba === 'object') {
          Bomba = "-"; // O cualquier mensaje que prefieras
        }
        return Bomba;
      },
      sortable:true,
      width:"180px",
    },
    {
      name: 'Extras',
      selector: row => {
        const fecha = row.FinVigencia;
        if (fecha === null || fecha === undefined) {
          return "No disponible";
        }
        if (typeof fecha === 'object') {
          return "Sin Fecha"; // O cualquier mensaje que prefieras
        }
        const [fechaR, hora] = fecha.split("T");
        return fechaR;
      },
      sortable:true,
      width:"150px",
    },    
    {
      name: 'Comentario',
      selector: row => {
        const comentario = row.Comentario
        if (comentario === null || comentario === undefined) {
          return "No disponible";
        }
        if (typeof comentario === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return comentario;
      },
      sortable:true,
      width:"200px",
    },
    {
      name: 'Autoriza',
      selector: row => {
        const autoriza = row.Autoriza
        if (autoriza === null || autoriza === undefined) {
          return "No disponible";
        }
        if (typeof autoriza === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return autoriza;
      },
      sortable:true,
      width:"250px",
    },
    {
      name: 'Actualizo',
      selector: row => {
        const actualizo = row.Actualizo
        if (actualizo === null || actualizo === undefined) {
          return "No disponible";
        }
        if (typeof actualizo === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return actualizo;
      },
      sortable:true,
      width:"250px",
    },
  ];
  const colExtras = [
    {
      name: 'Extra',
      selector: row => {
        const extra = row.Extra
        if (extra === null || extra === undefined) {
          return "No disponible";
        }
        if (typeof extra === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return extra;
      },
      sortable:true,
      width:"320px",
    },
    {
      name: 'Cantidad',
      sortable:true,
      selector: row => {
        const cantidad = row.Cantidad
        if (cantidad === null || cantidad === undefined) {
          return "No disponible";
        }
        if (typeof cantidad === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return cantidad;
      },
      width:"120px",
    },
    {
      name: 'Unidad',
      selector: row => {
        const unidad = row.Unidad
        if (unidad === null || unidad === undefined) {
          return "No disponible";
        }
        if (typeof unidad === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return unidad;
      },
      sortable:true,
      width:"100px",
    },{
      name: 'Precio',
      selector: row => {
        const precio = row.Precio
        if (precio === null || precio === undefined) {
          return "No disponible";
        }
        if (typeof precio === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return precio;
      },
      sortable:true,
      width:"100px",
    },{
      name: 'Total',
      selector: row => {
        var total = row.Total
        if (total === null || total === undefined) {
          total =  "0.00";
        }
        if (typeof total === 'object') {
          total = "0.00";
        }
        return total;
      },
      sortable:true,
      width:"100px",
    }
  ];
  const colMod = [
    {
      name: 'Cotización',
      selector: row => row.Cotizacion,
      width:"100px",
    },{
      name: 'Fecha Cambio',
      sortable:true,
      selector: row => {
        const fecha = row.FechaCambio;
        if (fecha === null || fecha === undefined) {
          return "No disponible";
        }
        if (typeof fecha === 'object') {
          return "Sin Fecha";
        }
        const [fecha_, hora] = fecha.split("T");
        return fecha_+" "+hora;
      },
      width:"180px",
    },
    {
      name: 'Usuario Actualizo',
      sortable:true,
      selector: row => {
        const userUpdate = row.UsuarioActualizo
        if (userUpdate === null || userUpdate === undefined) {
          return "No disponible";
        }
        if (typeof userUpdate === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return userUpdate;
      },
      width:"180px",
    },
    {
      name: 'Campo',
      sortable:true,
      selector: row => {
        const campo = row.Campo
        if (campo === null || campo === undefined) {
          return "No disponible";
        }
        if (typeof campo === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return campo;
      },
      width:"150px",
    },{
      name: 'Valor Ant.',
      sortable:true,
      selector: row => {
        const valAnt = row.ValorAnterior
        if (valAnt === null || valAnt === undefined) {
          return "No disponible";
        }
        if (typeof valAnt === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return valAnt;
      },
      width:"150px",
    },{
      name: 'Valor Nuevo',
      sortable:true,
      selector: row => {
        const valNue = row.ValorNuevo
        if (valNue === null || valNue === undefined) {
          return "No disponible";
        }
        if (typeof valNue === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return valNue;
      },
      width:"180px",
    },{
      name: 'Comentario',
      sortable:true,
      selector: row => {
        const comentario = row.Comentario
        if (comentario === null || comentario === undefined) {
          return "No disponible";
        }
        if (typeof comentario === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return comentario;
      },
      width:"180px",
    },
  ];
  //--------------------------------------------------------------------------------
  const GetCotizaciones_ = async (planta) =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
      // Llamada a la API
        const cotI = await GetCotizaciones(vFechaI, vFcaF, planta);
        Swal.close();  // Cerramos el loading
        if (cotI) {
          const filteredCotizaciones = cotI.filter(item => item.IdPlanta === planta);
          setPosts(cotI);
          setDTCotizacion(filteredCotizaciones);  // Procesar la respuesta
        } else {
            Swal.close();
            Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
        }
        const infoPla = await getPrecios('S',planta,'0');
        setDTListSeg(infoPla[0])
    } catch (error) {
        // Cerrar el loading y mostrar el error
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const transfPedido = async(idCo)=>{
    
  }
  // Buscador
  //************************************************************************************************************************************************************************** */
    // Función de búsqueda
  const onFindBusqueda = (e) => {
      setBPlanta(e.target.value);
      setFText(e.target.value);
  };
  const fBusqueda = () => {
      if(vBPlanta.length != 0){
          const valFiltrados = dtCotizacion.filter(dtCotizacion => 
          dtCotizacion.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
          );
          setDTCotizacion(valFiltrados);
      }else{
          GetCotizaciones_(plantasSel)
      }
  };
  const fCotizacion = dtCotizacion.filter(item => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.IdCotizacion.toString().includes(fText) || item.Cliente.toString().includes(fText) || item.Estatus.includes(fText) || item.Obra.toString().includes(fText) || 
      item.Vendedor.toString().includes(fText);
  });
  //**********************************MODALES**************************************************** */
  const regVisita_ = async(idCot,motivo,lat,lon) => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Registrando...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try{
      const ocList = await setVisitas(idCot, motivo, lat, lon);
      if(ocList)
      {
        Swal.close();
        Swal.fire(
          `${motivo} registrada`,
          `${motivo} registrada`,
          "success"
        );
      }
    }catch(error){
      Swal.close();
      Swal.fire("Error al guardar", error.message, "error");
    }
  };
  // -----------------------------------------------------------------
  // Mapeo: Mostrar el modal con el mapa de todas las visitas
  // -----------------------------------------------------------------
  const trazarRuta = (map,ocList) =>{
    const waypoints = ocList
    .map((point) => {
      if (point.latitud && point.longitud) {
        return L.latLng(point.latitud, point.longitud);
      }
      return null;
    }).filter((point) => point !== null);
    console.log(waypoints);
    if(waypoints.length > 1) {
      // Eliminar rutas anteriores
      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          map.removeLayer(layer); // Eliminar la ruta anterior
        }
      });
      // Crear y añadir la nueva ruta
      const routeControl = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }]
        },
        routeWhileDragging: true,
        createMarker: function () {
          return null; // No mostrar marcadores
        },
      }).addTo(map);
      map.fitBounds(L.latLngBounds(waypoints));
    } else {
      Swal.fire("No hay suficientes puntos", "Se necesitan al menos dos puntos para trazar una ruta.", "info");
    }
  
  }
  //************************* HANDLE*************************************************************** */
  const hTF = (e) =>{
    setTF(e.target.value)
  };
  const handleClockCh = (value) => {
    setTime(value);
  };
  const hPT = (e) =>{
    const pt = e.target.value * txtPrecio;
    setCant(e.target.value);
    setPrecioTotal(pt)
  };
  //******************************************************** */
  const downloadPDF = async(id) => {
    try{
        //const ocList = await getOComprasInd(id);
        
        // let idVehiculoString = String(ocList[0]?.idVehiculo ?? "Valor no disponible");
        // let nFactura = (ocList[0] && ocList[0].nFactura != null && typeof ocList[0].nFactura === 'string' && ocList[0].nFactura.trim() !== '') 
        //     ? ocList[0].nFactura 
        //     : '-';
        const doc = new jsPDF();
        const imgURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP3qFI_sXT_DHWAcUiaoXT_aJoW4V2E3qN3qHUZMG_q7vvjXNhf_KL8Zy_9iTTLkc72CY&usqp=CAU";
        //doc.addImage(imgURL, 'JPEG', 5, 5, doc.internal.pageSize.width, doc.internal.pageSize.height);
        doc.addImage(imgURL, 'JPEG', 5, 5, 40, 30);
        // Colocar el texto del encabezado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("Orden de Compra", 70, 30); 

        // Dibujar una línea debajo del encabezado
        doc.setLineWidth(0.5);  // Establece el grosor de la línea
        doc.line(10, 40, 200, 40);  // Dibuja una línea desde (10, 12) hasta (200, 12)
        doc.setFontSize(16);
        // Agregar contenido al PDF
        doc.setFont("helvetica", "regular");
        doc.text("No Orden Compra", 10, 50);
        doc.setFont("helvetica", "bold");
        doc.text('ORDEN', 60, 50);
        doc.setFont("helvetica", "regular");
        doc.text("Fecha", 100, 50);
        doc.setFont("helvetica", "bold");
        doc.text('2025-05-02', 120, 50);
        doc.setFont("helvetica", "regular");
        doc.text("Planta", 10, 70);
        doc.setFont("helvetica", "bold");  
        doc.text("No Factura", 60, 70);
        doc.setFont("helvetica", "bold");
        doc.text("Descripción", 10, 200);
        doc.setFont("helvetica", "bold");
        doc.text('----', 10, 210);
        //PIE DE PAGINA
        const marginBottom = 40;  // Márgenes desde la parte inferior de la página
        doc.addImage(imgURL, 'JPEG', 160, doc.internal.pageSize.height - marginBottom, 40, 30);
        // Guardar el archivo PDF con el nombre "mi_archivo.pdf"
        doc.save("CO_"+".pdf");
        
        // Cerrar el modal después de generar el PDF
        
    }catch(error){
        console.log(error)
    }
  }
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
  // const calculateRoute = useCallback(() => {
  //   if (location.latitude && location.longitude) {
  //     const origin = { lat: location.latitude, lng: location.longitude };
  //     const destination = { lat: 40.748817, lng: -73.985428 }; // Cambia esto por tu destino deseado

  //     const directionsService = new window.google.maps.DirectionsService();

  //     directionsService.route(
  //       {
  //         origin,
  //         destination,
  //         travelMode: window.google.maps.TravelMode.DRIVING,
  //       },
  //       (result, status) => {
  //         if (status === window.google.maps.DirectionsStatus.OK) {
  //           setDirections(result);
  //         } else {
  //           console.error('Error al calcular la ruta', status);
  //         }
  //       }
  //     );
  //   }
  // }, [location]);
  //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Lista Cotizaciones</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={3} md={3}>
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol xs={3} md={2}>
          <FechaI 
            vFechaI={vFechaI} 
            cFechaI={cFechaI} 
          />
        </CCol>
        <CCol xs={3} md={2}>
          <FechaF 
            vFcaF={vFcaF} 
            mFcaF={mFcaF}
          />
        </CCol>
      </CRow>
      <CRow>  
        <CCol xs={2} md={2} className='mt-4'>
            <CButton color='info' style={{"color":"white"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
            <CButton color='danger' style={{"color":"white"}} onClick={()=>{generarPDF(108589,dtCotizacionD)}} > 
                <CIcon icon={cilSearch} />
                {' '}PDF
            </CButton>
        </CCol>        
        <CCol xs={3} md={2} className='mt-4'>
            <CButton color='warning' style={{"color":"white"}} onClick={downloadCSV}>
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exportar
            </CButton>
        </CCol>
        <CCol xs={2} md={2} className='mt-4'>
            <CButton color='primary' onClick={irNuevo} > 
                <CIcon icon={cilPlus} />
                {' '}Nuevo
            </CButton>
        </CCol>
      </CRow>
      {shDiv && (
        <>
        <CRow className='mt-4 mb-4' id="divInfo">
          <CCol xs={2} md={2} className='mt-4'>
              <div style={{ textAlign: "left", marginTop: "10px", fontWeight: "bold" }}>
                  Total M3: {dtCotizacion.reduce((acc, item) => acc + (item.M3), 0)}
                </div>
          </CCol>
          <CCol xs={3} md={3}>
            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
          </CCol>
        </CRow>
        <CRow className='mt-4 mb-4' id="divTb">
          <DataTable
            columns={colCot}
            data={fCotizacion}
            pagination
            persistTableHead
            subHeader
          />
          
        {/* Modal para mostrar el MAPA con TODOS los puntos */}
        <CModal
          backdrop="static"
          visible={mCotizaciones}
          onClose={() => setMCotizaciones(false)}
          fullscreen
        >
          <CModalHeader>
            <CModalTitle>Cotización No. {noCotSel}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CTabs activeItemKey="cot">
              <CTabList variant='tabs' layout='justified'>
                  <CTab itemKey='cot'>COTIZACIÓN</CTab>
                  <CTab itemKey='ext'>EXTRAS</CTab>
                  <CTab itemKey='seg'>SEGUIMIENTO</CTab>
                  <CTab itemKey='cli'>CLIENTES/OBRA</CTab>
                  <CTab itemKey='mod'>LOG MODIFICACIONES</CTab>
              </CTabList>
              <CTabContent>
                  <CTabPanel itemKey="cot">
                      <CRow className='mt-2'>
                        <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                        Cliente
                        </CFormLabel>
                        <CCol xs={4} md={4}>
                          <CFormInput
                            type="text"
                            id="txtNoCliente"
                            floatingClassName="mb-3"
                            floatingLabel="Cliente"
                            placeholder="0000 CLIENTE"
                            value={codClie+'/'+cliente}
                            disabled
                          />
                        </CCol>
                        <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                        Vendedor
                        <span style={{ marginLeft: "8px" }}>{vendedor}</span>
                        </CFormLabel>
                        <CCol xs={4} md={4} className='mt-2'>
                          <CFormSelect size="md" className="mb-3" aria-label="Vendedor" value={codVendedor} onChange={(e) => setCodVendedor(e.target.value)}>
                            <option>-</option>
                            {asesor.map((a, index) => (
                              <option key={index} value={a.IdUsuario}>
                                {a.Nombre}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                      </CRow>
                      <CRow className='mt-2'>
                        <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          Obra
                        </CFormLabel>
                        <CCol xs={3} md={3}>
                          <CFormInput
                            type="text"
                            id="txtNoObra"
                            floatingClassName="mb-3"
                            floatingLabel="NoObra"
                            placeholder="0000"
                            value={codObra}
                          />
                        </CCol>
                        <CCol xs={1} md={1} className='mt-2'>
                          <CButton color='primary' style={{"color":"white"}} onClick={btnBuscar} >
                            <CIcon icon={cilSearch} />
                          </CButton>
                        </CCol>
                        <CCol xs={6} md={6}>
                          <CFormInput
                            type="text"
                            id="txtObra"
                            floatingClassName="mb-3"
                            floatingLabel="Obra"
                            placeholder="----"
                            value={Obra}
                            disabled
                          />
                        </CCol>
                      </CRow>
                      <CRow className='mt-2'>
                        <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                        Observaciones
                        </CFormLabel>
                        <CCol xs={10} md={10}>
                          <CFormTextarea
                            className="mb-3"
                            placeholder="Observaciones"
                          ></CFormTextarea>
                        </CCol>
                      </CRow>
                      <CRow className='mt-2'>
                        <CCol xs={2} md={2}>
                          <CFormCheck inline id="chkCc" value="cc" label="Condiciones comerciales" checked={concom} onChange={(e) => setConCom(e.target.checked)} />
                        </CCol>
                        <CCol xs={2} md={2}>
                          <CFormCheck inline id="chkTl" value="Tl" label="Total" checked={total} onChange={(e) => setTotal(e.target.checked)} />
                        </CCol>
                        <CCol xs={1} md={1}>
                          <CFormCheck inline id="chkIv" value="IVA" label="IVA" checked={IVA} onChange={(e) => setIVA(e.target.checked)} />
                        </CCol>
                        <CCol xs={3} md={3}>
                          <CFormCheck inline id="chkObs" value="Observaciones" label="Observaciones" checked={chkObs} onChange={(e) => setChkObs(e.target.checked)} />
                        </CCol>
                        <CCol xs={3} md={3}>
                          <CFormLabel htmlFor="staticEmail" className="me-2">
                            Estatus
                          </CFormLabel>
                          <CFormSelect size="md" aria-label="Estatus" value={sEstatus} onChange={(e) => setsEstatus(e.target.value)}>
                            <option value="">-</option>
                              {estatus.map((e, index) => (
                                <option key={index} value={e}>
                                  {e}
                                </option>
                              ))}
                          </CFormSelect>
                        </CCol>
                      </CRow>
                      <CRow className='mt-2 mb-2'>
                          <CCol xs={6} md={4}>
                              <br />
                              <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                          </CCol>
                          <DataTable
                              columns={colCotMod}
                              data={dtCotizacionD}
                              pagination
                              persistTableHead
                              subHeader
                          />
                      </CRow>
                  </CTabPanel>
                  <CTabPanel itemKey="ext">
                      <CRow className='mt-2'>

                      </CRow>
                      <CRow className='mt-2'>
                        <DataTable
                          columns={colExtras}
                          data={dtExtras}
                          pagination
                          persistTableHead
                          subHeader
                        />
                      </CRow>
                  </CTabPanel>
                  <CTabPanel itemKey="seg">
                    <CRow className='mt-2'>
                      <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                      Descripción del Seguimiento
                      </CFormLabel>
                      <CCol xs={6} md={4}>
                        <CFormSelect size="md" value={sEstatus} onChange={(e) => setsEstatus(e.target.value)}>
                          <option value="">-</option>
                            {dtListSeg.map((e, index) => (
                              <option key={index} value={e.IdAccion}>
                                {e.Descripcion}
                              </option>
                            ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                    <CRow className='mt-2'>
                      <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                      Fecha
                      </CFormLabel>
                      <CCol xs={3} md={3}>
                        <div>
                          <div className='mt-2'>
                              <DatePicker 
                                id='fcaF'
                                selected={vFcaF} 
                                onChange={mFcaF} 
                                placeholderText='Fecha' 
                                dateFormat="yyyy/MM/dd"
                                className='form-control' />
                          </div>
                        </div>
                      </CCol>
                      <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                      Hora
                      </CFormLabel>
                      <CCol xs={3} md={3}>
                        <DatePicker
                          selected={hora}
                          onChange={(date) => setHora(date)}
                          showTimeSelect
                          showTimeSelectOnly   // 👈 solo muestra horas/minutos
                          timeIntervals={15}   // 👈 intervalos de minutos (ej: cada 15)
                          timeCaption="Hora"
                          dateFormat="HH:mm"   // 👈 formato de salida
                          className="form-control"
                        />
                      </CCol>
                    </CRow>
                    <CRow className='mt-2'>
                      <CCol xs={3} md={3}>
                        <CButton color='primary' style={{"color":"white"}} onClick={btnBuscar} > 
                          <CIcon icon={cilPlus} />
                          {' '}Agregar
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className='mt-2'>
                      <DataTable
                        columns={colExtras}
                        data={[]}
                        pagination
                        persistTableHead
                        subHeader
                      />
                    </CRow>
                  </CTabPanel>
                  <CTabPanel itemKey="cli">
                      <CRow className='mt-2'>
                        <CCol xs={3} md={3}>
                          <CFormCheck
                            type="radio"
                            name="exampleRadios"
                            id="rCliente"
                            value="C"
                            label="Cliente"
                            checked={sTF === "C"}
                            onChange={() => setTF("C")}
                          />
                        </CCol>
                        <CCol xs={3} md={3}>                          
                          <CFormCheck
                            type="radio"
                            name="exampleRadios"
                            id="rObra"
                            value="O"
                            label="Obra"
                            checked={sTF === "O"}
                            onChange={() => setTF("O")}
                          />
                        </CCol>
                      </CRow>
                      {sTF === "C" && (
                      <CRow className='mt-3'>
                        <CCol>
                          <h6>Datos de Cliente</h6>
                          {/* aquí tus inputs de cliente */}
                        </CCol>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          Razón Social
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="Nombre Razon Social"
                              value={cliente}
                              onChange={(e) => setCliente(e.target.value)}
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          RFC
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          MÉTODO DE PAGO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          4 ÚLTIMOS DÍGITOS CUENTA
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <br/>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          CALLE
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          No. EXTERIOR
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          COLONIA
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          MUNICIPIO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          ESTADO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          TELEFONO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          PERSONA DE CONTACTO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          CLAVE CFDI
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                      </CRow>
                      )}
                      {sTF === "O" && (
                      <CRow className='mt-3'>
                        <CCol>
                          <h6>Datos de Obra</h6>
                          {/* aquí tus inputs de cliente */}
                        </CCol>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          NOMBRE DE OBRA
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                              value={Obra}
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          NÚMERO DE CLLIENTE
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                        <hr/>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          DIRECCIÓN
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                              value={direccion}
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          COLONIA
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          MUNICIPIO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          ESTADO
                          </CFormLabel>
                          <CCol xs={10} md={10}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                         <CRow>
                          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                          COORDENADAS
                          </CFormLabel>
                          <CCol xs={5} md={5}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={5} md={5}>
                            <CFormTextarea
                              className="mb-3"
                              placeholder="---"
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                      </CRow>
                      )}
                  </CTabPanel>
                  <CTabPanel itemKey="mod">
                      <CRow className='mt-2'>
                        <DataTable
                          columns={colMod}
                          data={dtMod}
                          pagination
                          persistTableHead
                          subHeader
                        />
                    </CRow>
                  </CTabPanel>
              </CTabContent>
            </CTabs>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setMCotizaciones(false)}>
              Cerrar
            </CButton>
          </CModalFooter>
        </CModal>
        {/* Modal Modificar Cotizacion detalle item */}
          <CModal
            backdrop="static"
            visible={mDetalleItem}
            onClose={() => setMDetalleItem(false)}
          >
          <CModalHeader>
            <CModalTitle>Cotización Detalle Item {noCotSel}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className='mt-2 mb-2'>
              <CCol xs={12} md={4}>
                <CFormInput
                  type="text"
                  id="txtIdCot"
                  floatingClassName="mb-3"
                  floatingLabel="Cotización"
                  placeholder="0"
                  value={noCotSel}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={8}>
                <CFormInput
                  type="text"
                  id="txtExtra"
                  floatingClassName="mb-3"
                  floatingLabel="Extra"
                  placeholder="---"
                  value={txtExtra}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={4}>
                <CFormInput
                  type="text"
                  id="txtCantidad"
                  floatingClassName="mb-3"
                  floatingLabel="Cantidad"
                  placeholder="0"
                  value={txtCant}
                  onChange={hPT}
                />
              </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
              <CCol xs={12} md={4}>
                <CFormInput
                  type="text"
                  id="txtCantidadCot"
                  floatingClassName="mb-3"
                  floatingLabel="Cantidad Cotizado"
                  placeholder="0"
                  value={txtCantCot}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={4}>
                <CFormInput
                  type="text"
                  id="txtPrecio"
                  floatingClassName="mb-3"
                  floatingLabel="Precio"
                  placeholder="0"
                  value={txtPrecio}
                  disabled
                />
              </CCol>
              <CCol xs={12} md={4}>
                <CFormInput
                  type="text"
                  id="txtPrecioUs"
                  floatingClassName="mb-3"
                  floatingLabel="Precio Usuario"
                  placeholder="0"
                  value={txtPrecioUser}
                  disabled
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} md={4}>
                <CFormInput
                  type="text"
                  id="txtFinal"
                  floatingClassName="mb-3"
                  floatingLabel="Precio Total"
                  placeholder="0"
                  value={txtPrecioTot}
                  disabled
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => setUpdPreCot()}>
              Actualizar
            </CButton>
            <CButton color="secondary" onClick={() => setMDetalleItem(false)}>
              Cerrar
            </CButton>
          </CModalFooter>
          </CModal>
        </CRow>
        </>
      )}
    </CContainer>
    </>
  )
}

export default LCotizacion
