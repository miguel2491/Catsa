import React, {useEffect, useState, useRef} from 'react'
import '../../estilos.css';
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { GetCotizaciones,convertArrayOfObjectsToCSV, getPedidosCot, getArchivo, setStatus, getCotizacionExtra, getCotizacionLog, getSegmentos,
  getSeguimientos, getObraCot, getClienteCot
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheck,
  cilClearAll,
  cilImage,
  cilMenu,
  cilPencil,
  cilShareAlt,
  cilTag,
  cilTrash
} from '@coreui/icons'
import BuscadorDT from '../base/parametros/BuscadorDT'
//import TabulatorTest from '../base/tables/Tabulator'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import { Rol } from '../../Utilidades/Roles'




const LCotizacion = () => {    
  const navigate = useNavigate();
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  const [mPedidos, setMPedidos] = useState(false);
  const [mOpciones, setMOpciones] = useState(false);
  const [sEstatusC, setSEstatusC] = useState(null);
  const [dSeg, setDSeg] = useState('');
  const [time, setTime] = useState(null);
  const [chkFT, setChkFT] = useState('Cliente');
  //------------------Shows----------------------------
  const [shCO, setShCO] = useState('Cliente');
  //Arrays
  const [dtCotizacion, setDTCotizacion] = useState([]);
  const [dtPedidos, setDTPedidos] = useState([]);
  const [dtExtras, setDTExtras] = useState([]);
  const [dtLog, setDTLog] = useState([]);
  const [dtSeg, setDTSeg] = useState([]);
  const [cmbSeg, setCmbSeg] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };

  // Almacena los puntos de las visitas
  const [visitPoints, setVisitPoints] = useState([])
  // Modal para acciones (Registrar visita, Registrar llamada, Mapeo)
  const [mAcciones, setMAcciones] = useState(false)
  const [selectedCotizacion, setSelectedCotizacion] = useState(null)
  // Modal para mostrar el mapa
  const [mapeoModal, setMapeoModal] = useState(false)

  const handleExtraActions = (idCotizacion) => {
    setSelectedCotizacion(idCotizacion)
    setMAcciones(true)
  }


  //------------ FROMS CLIENTE/OBRAS ------------------------------------------
  const [RazonTxtC, setRazonC] = useState('');
  const [RFCTxtC, setRFCC] = useState('');
  const [PagoTxtC, setPagoC] = useState('');
  const [DigitosTxtC, setDigitosC] = useState('');
  const [DFiscalTxtC, setDFiscalC] = useState('');
  const [CalleTxtC, setCalleC] = useState('');
  const [nExtTxtC, setNExtC] = useState('');
  const [ColTxtC, setColoniaC] = useState('');
  const [MunTxtC, setMunC] = useState('');
  const [EdoTxtC, setEdoC] = useState('');
  const [TelTxtC, setTelC] = useState('');
  const [PContactoTxtC, setPContactoC] = useState('');
  const [CFDITxtC, setCFDIC] = useState('');
  const [nClienteTxt, setNCliente] = useState('');
  const [nObraTxt, setNObra] = useState('');
  const [DirTxtO, setDirO] = useState('');
  const [ColTxtO, setColoniaO] = useState('');
  const [MunTxtO, setMunicO] = useState('');
  const [EstadoTxtO, setEstadoO] = useState('');
  //--------------------------- Buscador --------------------------------------
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('');
  // ROLES
  const userIsAdmin = Rol('Admin');
  useEffect(()=>{    
    if(vFechaI!=null){
      if(plantasSel.length >0 && vFechaI.length > 0 && vFcaF.length > 0)
        {
          console.log(plantasSel, vFechaI, vFcaF);
          GetCotizaciones_();
        }
    }
  },[]);
  const mCambio = (event) => {
    const pla = event.target.value; 
    if(pla.length > 0)
    {
      setPlantas(pla);
      if(posts.length>0){
        const filteredCotizaciones = posts.filter(item => item.IdPlanta === pla);
        setDTCotizacion(filteredCotizaciones);
      }else{
        GetCotizaciones_(pla);
      }
    }else{
      setPlantas(pla);
      if(posts.length>0){
        setDTCotizacion(posts);
      }
    }
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  //--------------------------- COLS -----------------------------------------------
  const colCot = [
    {
      name: 'ACCIONES',
      selector: row => row.IdCotizacion,
      width:"200px",
      cell: (row) => (
        <div>
          <CRow>
            {userIsAdmin && (row.Estatus == 'Aceptada') && (
              <CCol xs={6} md={3} lg={3}>
                <CButton
                  color="warning"
                  onClick={() => viewPedidos(row.IdCotizacion)}
                  size="sm"
                  className="me-2"
                  title="Autorizar"
                >
                  <CIcon icon={cilCheck} />
                </CButton>
              </CCol>
            )}
            
            {userIsAdmin && (
              <CCol xs={6} md={3} lg={3}>
                <CButton
                  color="info"
                  onClick={() => vCotizacion(row.IdCotizacion)}
                  size="sm"
                  className="me-2"
                  title="Modificar"
                >
                  <CIcon icon={cilPencil} style={{'color':'white'}} />
                </CButton>
              </CCol>
            )}
            
            {userIsAdmin && (
              <CCol xs={6} md={3} lg={3}>
                <CButton
                  color="danger"
                  onClick={() => setNFactura(row.IdCotizacion)}
                  size="sm"
                  className="me-2"
                  title="Eliminar"
                >
                  <CIcon icon={cilTrash} style={{'color':'white'}} />
                </CButton>
              </CCol>
            )}
            
            {userIsAdmin && (
              <CCol xs={6} md={3} lg={3}>
                <CButton
                  color="success"
                  onClick={() => mEstatus(row.IdCotizacion, row.Estatus)}
                  size="sm"
                  className="me-2"
                  title="Estatus"
                >
                  <CIcon icon={cilCheck} style={{'color':'white'}} />
                </CButton>
              </CCol>
            )}
    
            <CCol xs={6} md={3} lg={3}>
              <CButton
                color="secondary"
                onClick={() => handleExtraActions(row.IdCotizacion)}
                size="sm"
                className="me-2"
                title="Acciones adicionales"
              >
                <CIcon icon={cilMenu} />
              </CButton>
            </CCol>
          </CRow>
        </div>
      ),
    },
    
    {
      name: 'ID',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"120px",
    },{
      name: 'Fecha',
      selector: row => {
        const fecha = row.Creo;
        if (fecha === null || fecha === undefined) {
          return "No disponible";
        }
        if (typeof fecha === 'object') {
          return "Sin Fecha"; // O cualquier mensaje que prefieras
        }
        const [asesor, fechaA] = fecha.split(" ");
        return fechaA;
      },
      sortable:true,
      width:"150px",
    },
    {
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
    },
    {
      name: 'Estatus',
      selector: row => row.Estatus,
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
      name: 'Autorizo',
      selector: row => {
        const autorizo = row.Autorizante
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
  const colPed = [
    {
      name: 'ACCIONES',
      selector: row => row.IdPedido,
      width:"200px",
      cell: (row) => (
        <div>
          <CRow>
            {userIsAdmin && (
              <CCol xs={6} md={4} lg={4}>
                <CButton
                  color="warning"
                  onClick={() => autorizarPedido(row.IdPedido)}
                  size="sm"
                  className="me-2"
                  title="Autorizar"
                >
                  <CIcon icon={cilCheck} />
                </CButton>
              </CCol>
            )}
            {userIsAdmin && (row.Archivos) && (
              <CCol xs={6} md={6} lg={6}>
                <CButton
                  color="primary"
                  onClick={() => viewPago(row.IdPedido)}
                  size="sm"
                  className="me-2"
                  title="Ver Pago"
                >
                  <CIcon icon={cilImage} style={{'color':'white'}} />
                </CButton>
                </CCol>
            )}
          </CRow>
      </div>
      ),
    },{
      name: 'ID',
      selector: row => row.IdPedido,
      sortable:true,
      width:"80px",
    },{
      name: 'Fecha Pedido',
      selector: row => {
        const fecha = row.FechaHoraPedido;
        if (fecha === null || fecha === undefined) {
          return "No disponible";
        }
        if (typeof fecha === 'object') {
          return "Sin Fecha"; // O cualquier mensaje que prefieras
        }
        const [fecha_, hora] = fecha.split("T");
        return fecha_+" "+hora;
      },
      sortable:true,
      width:"250px",
    },
    {
      name: 'Obra',
      selector: row => {
        var nobra = row.NoObra
        if (nobra === null || nobra === undefined) {
          nobra =  "-";
        }
        if (typeof nobra === 'object') {
          nobra = "-"; // O cualquier mensaje que prefieras
        }
        return nobra;
      },
      sortable:true,
      width:"200px",
    },
    {
      name: 'Metros',
      selector: row => row.CantidadM3,
      sortable:true,
      width:"100px",
    },
    {
      name: 'Elemento',
      selector: row => {
        var elemento = row.Elemento
        if (elemento === null || elemento === undefined) {
          elemento = "No disponible";
        }
        if (typeof elemento === 'object') {
          elemento = "Sin Datos"; // O cualquier mensaje que prefieras
        }
        return elemento;
      },
      sortable:true,
      width:"200px",
    },
    {
      name: 'Producto',
      selector: row => {
        var elemento = row.Producto
        if (elemento === null || elemento === undefined) {
          elemento = "No disponible";
        }
        if (typeof elemento === 'object') {
          elemento = "Sin Datos"; // O cualquier mensaje que prefieras
        }
        return elemento;
      },
      sortable:true,
      width:"200px",
    },
  ];
  const colExtras = [
  {
      name: 'Extra',
      selector: row => row.Extra,
      sortable:true,
      width:"250px",
    },{
      name: 'Cantidad',
      selector: row => {
        const cantidad = row.Cantidad;
        if (cantidad === null || cantidad === undefined) {
          return "0";
        }
        if (typeof cantidad === 'object') {
          return "0"; // O cualquier mensaje que prefieras
        }
        return cantidad;
      },
      sortable:true,
      width:"150px",
    },
    {
      name: 'Unidad',
      selector: row => {
        var unidad = row.Unidad
        if (unidad === null || unidad === undefined) {
          unidad =  "-";
        }
        if (typeof unidad === 'object') {
          unidad = "-"; // O cualquier mensaje que prefieras
        }
        return unidad;
      },
      sortable:true,
      width:"80px",
    },
    {
      name: 'Precio',
      selector: row => row.Precio,
      sortable:true,
      width:"100px",
    },
    {
      name: 'Total',
      selector: row => {
        var elemento = row.Total
        if (elemento === null || elemento === undefined) {
          elemento = "0";
        }
        if (typeof elemento === 'object') {
          elemento = "0"; // O cualquier mensaje que prefieras
        }
        return elemento;
      },
      sortable:true,
      width:"100px",
    },
  ];
  const colLog = [
    {
        name: 'ID',
        selector: row => row.Cotizacion,
        sortable:true,
        width:"80px",
      },{
        name: 'FechaCambio',
        selector: row => {
          const fecha = row.FechaCambio;
          if (fecha === null || fecha === undefined) {
            return "No disponible";
          }
          if (typeof fecha === 'object') {
            return "Sin Fecha"; // O cualquier mensaje que prefieras
          }
          const [fecha_, hora] = fecha.split("T");
          return fecha_+" "+hora;
        },
        sortable:true,
        width:"200px",
      },
      {
        name: 'UsuarioActualizo',
        selector: row => {
          var usuarioAct = row.UsuarioActualizo
          if (usuarioAct === null || usuarioAct === undefined) {
            usuarioAct =  "-";
          }
          if (typeof usuarioAct === 'object') {
            usuarioAct = "-"; // O cualquier mensaje que prefieras
          }
          return usuarioAct;
        },
        sortable:true,
        width:"150px",
      },
      {
        name: 'Campo',
        selector: row => {
          var Campo = row.Campo
          if (Campo === null || Campo === undefined) {
            Campo =  "-";
          }
          if (typeof Campo === 'object') {
            Campo = "-"; // O cualquier mensaje que prefieras
          }
          return Campo;
        },
        sortable:true,
        width:"200px",
      },
      {
        name: 'Valor Anterior',
        selector: row => {
          var elemento = row.ValorAnterior
          if (elemento === null || elemento === undefined) {
            elemento = "No disponible";
          }
          if (typeof elemento === 'object') {
            elemento = "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return elemento;
        },
        sortable:true,
        width:"200px",
      },
      {
        name: 'Valor Nuevo',
        selector: row => {
          var elemento = row.ValorNuevo
          if (elemento === null || elemento === undefined) {
            elemento = "No disponible";
          }
          if (typeof elemento === 'object') {
            elemento = "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return elemento;
        },
        sortable:true,
        width:"200px",
      },
      {
        name: 'Comentario',
        selector: row => {
          var elemento = row.Comentario
          if (elemento === null || elemento === undefined) {
            elemento = "No disponible";
          }
          if (typeof elemento === 'object') {
            elemento = "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return elemento;
        },
        sortable:true,
        width:"200px",
      },
    ];
  const colSeg = [
  {
      name: 'ID',
      selector: row => row.IdSeguimiento,
      sortable:true,
      width:"80px",
  },{
    name: 'COTIZACION',
    selector: row => row.IdCotizacion,
    sortable:true,
    width:"80px",
  },{
    name: 'DESCRIPCIÓN',
    selector: row => {
      const desc = row.Descripcion;
      if (desc === null || desc === undefined) {
        return "No disponible";
      }
      if (typeof desc === 'object') {
        return "-"; // O cualquier mensaje que prefieras
      }
      return desc;
    },
    sortable:true,
    width:"250px",
  },
  {
    name: 'Fecha',
    selector: row => {
      var Fca = row.Fecha
      if (Fca === null || Fca === undefined) {
        Fca =  "-";
      }
      if (typeof Fca === 'object') {
        Fca = "-"; // O cualquier mensaje que prefieras
      }
      const[fecha, hora] = Fca.split("T"); 
      return fecha;
    },
    sortable:true,
    width:"150px",
  },
  {
    name: 'Hora',
    selector: row => {
      var Fca = row.Fecha
      if (Fca === null || Fca === undefined) {
        Fca =  "-";
      }
      if (typeof Fca === 'object') {
        Fca = "-"; // O cualquier mensaje que prefieras
      }
      const[fecha, hora] = Fca.split("T"); 
      return hora;
    },
    sortable:true,
    width:"150px",
  },
  {
    name: 'Usuario Cambio',
    selector: row => {
      var Campo = row.UsuarioCambio
      if (Campo === null || Campo === undefined) {
        Campo =  "-";
      }
      if (typeof Campo === 'object') {
        Campo = "-"; // O cualquier mensaje que prefieras
      }
      return Campo;
    },
    sortable:true,
    width:"150px",
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
          console.log(cotI)
          const filteredCotizaciones = cotI.filter(item => item.IdPlanta === planta);
          setPosts(cotI);
          setDTCotizacion(filteredCotizaciones);  // Procesar la respuesta
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
  // PEDIDOS
  const viewPedidos = async(id) =>{
    setMPedidos(true)
    //LOGICA CARGA TABLA PEDIDO
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
        Swal.showLoading();  // Muestra la animación de carga
        getPedidos_(id)
      }
    });
  }
  const getPedidos_ = async (id) => {
    try{
      Swal.close();
      const ocList = await getPedidosCot(id);
      if(ocList){
        setDTPedidos(ocList)
      }
      console.log(ocList)
    }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }

  }
  const autorizarPedido = async(id) =>{
    Swal.fire({
              title: "¿Autorizar Pedido?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Autorizar"
            }).then((result) => {
              if (result.isConfirmed) {
                cPedido(id)
              }
            });
  }
  const cPedido = async(id) =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Autorizando...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });    
    setTimeout(function(){
      Swal.close();
      Swal.fire({
        title: "Autorizado Correctamente",
        icon: "success",
        draggable: true
      });
    },3000);
  }
  const viewPago = async(id) =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Buscando...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
      Swal.close();
      try{
        const extFile = await getArchivo(id);
        Swal.close();
        console.log(extFile)
        if(extFile){
          Swal.fire({
            title: "Peido #"+id,
            text: "Pedido",
            imageUrl: "http://apicatsa.catsaconcretos.mx:2543/Uploads/DocPedidos/"+id+"/"+extFile,
            imageWidth: 600,
            imageHeight: 400,
            imageAlt: "Pedido"
          });
        }
      }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
      } 
  }
  const vCotizacion = async(id) =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Buscando...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    navigate('/ventas/Cotizador/'+id);
  }
  // Opciones
  const openMOpciones = (id) =>{
    setMOpciones(true);
    getExtras(id);
    getSeg();
    gtSeguimientos_(id);
    getObraCot_(id);
    getClienteCot_(id);
  }
  const getExtras = async(id)=>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
      Swal.close();
      const ocList = await getCotizacionExtra(id);
      if(ocList){
        setDTExtras(ocList)
      }
      getLogs(id);
    }catch(error){
      Swal.close()
      console.error(error)
    }
  }
  const getLogs = async(id)=>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
      Swal.close();
      const ocList = await getCotizacionLog(id);
      if(ocList){
        setDTLog(ocList)
      }
    }catch(error){
      Swal.close()
      console.error(error)
    }
  }
  const getSeg = async()=>{
    try {
      const ocList = await getSegmentos();
      if(ocList){
        setCmbSeg(ocList)
      }
    }catch(error){
      console.error(error)
    }
  }
  const getClienteCot_ = async(id)=>{
    //Buscar en ArrayCotizador NoCliente y NoObra
    const ArrayCO = dtCotizacion.filter(item => item.IdCotizacion === id);
    let idC = (ArrayCO && ArrayCO[0] && ArrayCO[0].NoCliente !== "") ? ArrayCO[0].NoCliente:'0';
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
      Swal.close();
      const ocList = await getClienteCot(idC);
      if(ocList){
        const ArrayC = ocList.sort((a,b) => a.RFC - b.RFC);
        setRazonC(ArrayC[0]?.Nombre && (typeof ArrayC[0].Nombre === 'object' ? Object.keys(ArrayC[0].Nombre) > 0: true)?ArrayC[0].Nombre:'-');
        setRFCC(ArrayC[0]?.RFC && (typeof ArrayC[0].RFC === 'object' ? Object.keys(ArrayC[0].RFC) > 0: true)?ArrayC[0].RFC:'-');
        setPagoC(ArrayC[0]?.MetodoPago && (typeof ArrayC[0].MetodoPago === 'object' ? Object.keys(ArrayC[0].MetodoPago) > 0: true)?ArrayC[0].MetodoPago:'-');
        setDigitosC('****');
        setCalleC(ArrayC[0]?.Calle && (typeof ArrayC[0].Calle === 'object' ? Object.keys(ArrayC[0].Calle) > 0: true)?ArrayC[0].Calle:'-');
        setNExtC(ArrayC[0]?.Numero && (typeof ArrayC[0].Numero === 'object' ? Object.keys(ArrayC[0].Numero) > 0: true)?ArrayC[0].Numero:'-');
        setColoniaC(ArrayC[0]?.Colonia && (typeof ArrayC[0].Colonia === 'object' ? Object.keys(ArrayC[0].Colonia) > 0: true)?ArrayC[0].Colonia:'-');
        setMunC(ArrayC[0]?.Municipio && (typeof ArrayC[0].Municipio === 'object' ? Object.keys(ArrayC[0].Municipio) > 0: true)?ArrayC[0].Municipio:'-');
        setEdoC(ArrayC[0]?.Estado && (typeof ArrayC[0].Estado === 'object' ? Object.keys(ArrayC[0].Estado) > 0: true)?ArrayC[0].Estado:'-');
        setTelC(ArrayC[0]?.Telefono && (typeof ArrayC[0].Telefono === 'object' ? Object.keys(ArrayC[0].Telefono) > 0: true)?ArrayC[0].Telefono:'-');
        setPContactoC('-');
        setCFDIC(ArrayC[0]?.ClaveCFDI && (typeof ArrayC[0].ClaveCFDI === 'object' ? Object.keys(ArrayC[0].ClaveCFDI) > 0: true)?ArrayC[0].ClaveCFDI:'-');
      }
      //getLogs(id);
    }catch(error){
      Swal.close()
      console.error(error)
    }
  }
  const getObraCot_ = async(id)=>{
    const ArrayCO = dtCotizacion.filter(item => item.IdCotizacion === id);
    let idC = (ArrayCO && ArrayCO[0] && ArrayCO[0].NoCliente !== "") ? ArrayCO[0].NoCliente:'0';
    let idO = (ArrayCO && ArrayCO[0] && ArrayCO[0].NoObra !== "") ? ArrayCO[0].NoObra : '0';
    setNCliente(idC);
    setNObra(idO)
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
      Swal.close();
      const ocList = await getObraCot(idC, idO);
      if(ocList){
        //Buscar en ArrayCotizador NoCliente y NoObra
        const ArrayC = ocList.sort((a,b) => a.Estado - b.Estado);
        console.log(ArrayC)
        setDirO((ArrayC[0] && ArrayC[0] && ArrayC[0].Direccion !== "") ? ArrayC[0].Direccion:'-');
        setColoniaO((ArrayC[0] && ArrayC[0] && ArrayC[0].Colonia !== "") ? ArrayC[0].Colonia:'-');
        setMunicO((ArrayC[0] && ArrayC[0] && ArrayC[0].Municipio !== "") ? ArrayC[0].Municipio:'-');
        setEstadoO((ArrayC[0] && ArrayC[0] && ArrayC[0].Estado !== "") ? ArrayC[0].Estado:'-')        
      }
      //getLogs(id);
    }catch(error){
      Swal.close()
      console.error(error)
    }
  }

  const gtSeguimientos_ = async(id)=>{
    try
    {
      const ocList = await getSeguimientos(id);
      console.log(ocList)
      if(ocList)
      {
        setDTSeg(ocList)
      }
    }
    catch(error)
    {
      console.error(error)
    }
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
  const mEstatus = async(id, estatus) =>{
    try{
      const {value:selectedOption} = await Swal.fire({
        title: "Elige una opción",
        input: "select",
        inputValue:estatus,
        inputOptions: {
          Cancelada: "Cancelada",
          Aceptada: "Aceptada",
          Negociando: "Negociando",
          Perdida: "Perdida",
          Prospecto: "Prospecto",
        },
        inputPlaceholder: "Selecciona una opción",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "¡Debes elegir una opción!";
          }
        },
      });
      if(selectedOption){
        chStatus(id, selectedOption)
      }
    } catch(error){
      console.error("Error al mostrar SweetAlert2:", error)
    }
  }
  const chStatus = async (id, estatus) =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Actualizando...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
        // Llamada a la API
        const cotI = await setStatus(id, estatus);
        if (cotI) {
          Swal.close();
          Swal.fire("Correcto", "Se actualizo Correctamente", "success");
          GetCotizaciones_(plantasSel)
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

  const handleRegistrarVisita = async (idCotizacion) => {
    const idUsuario = localStorage.getItem('idUsuario') || 0 // O de donde obtengas tu usuario

    if (!navigator.geolocation) {
      Swal.fire("Error", "Tu navegador no soporta Geolocalización", "error")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        // Guarda localmente en el estado. (Podrías hacer una petición POST a tu backend)
        setVisitPoints((prevPoints) => [
          ...prevPoints,
          { lat, lng, idUsuario, idCotizacion }
        ])

        Swal.fire(
          "Visita registrada",
          `Se guardó la visita en lat: ${lat}, lng: ${lng}`,
          "success"
        )
      },
      (error) => {
        Swal.fire("Error al obtener ubicación", error.message, "error")
      }
    )
  }

  // -----------------------------------------------------------------
  // Registrar llamada
  // -----------------------------------------------------------------
  const handleRegistrarLlamada = (idCotizacion) => {
    const idUsuario = localStorage.getItem('idUsuario') || 0
    const fechaHoraActual = new Date().toISOString()

    // Aquí podrías hacer una llamada POST a tu backend
    console.log("Registrar llamada:", {
      idUsuario,
      idCotizacion,
      fechaHoraActual
    })

    Swal.fire(
      "Llamada registrada",
      `Se registró la llamada en la fecha/hora: ${fechaHoraActual}`,
      "success"
    )
  }

  // -----------------------------------------------------------------
  // Mapeo: Mostrar el modal con el mapa de todas las visitas
  // -----------------------------------------------------------------
  const handleMapeo = () => {
    setMapeoModal(true)
  }
  
  
  
  
  //************************* HANDLE*************************************************************** */
  const hDSeg = (e) =>{
    setDSeg(e.target.value)
  };
  const handleClockCh = (value) => {
    setTime(value);
  };
  const hRadioCh = (e) => {
    setChkFT(e.target.value);
    if(e.target.value == "Cliente"){
      setShCO(true)
    }else{
      setShCO(false)
    }
  };
  const hNCliente = (e) => {
    setNCliente(e.target.value);
  };
  const hNObra = (e) => {
    setNObra(e.target.value);
  };
  const hRazon = (e) => {
    setRazonC(e.target.value);
  };
  const hRFC = (e) => {
    setRFCC(e.target.value);
  };
  const hMPago = (e) => {
    setPagoC(e.target.value);
  };
  const hDigCue = (e) => {
    setDigitosC(e.target.value);
  };
  const hDirF = (e) => {
    setDFiscalC(e.target.value);
  };
  const hCalleC = (e) => {
    setCalleC(e.target.value);
  };
  const hNExtC = (e) => {
    setNExtC(e.target.value);
  };
  const hColC = (e) => {
    setColoniaC(e.target.value);
  };
  const hMunC = (e) => {
    setMunC(e.target.value);
  };
  const hEdoC = (e) => {
    setEdoC(e.target.value);
  };
  const hTelC = (e) => {
    setTelC(e.target.value);
  };
  const hCFDI = (e) => {
    setCFDIC(e.target.value);
  };
  const hDirO = (e) => {
    setDir(e.target.value);
  };
  const hColO = (e) => {
    setColonia(e.target.value);
  };
  const hMunO = (e) => {
    setMunic(e.target.value);
  };
  const hEdoO = (e) => {
    setEstado(e.target.value);
  };
  //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Cotizaciones</h1>
      <CRow className='mt-3 mb-3'>
        <CCol sm="auto">
          <FechaI 
            vFechaI={vFechaI} 
            cFechaI={cFechaI} 
          /></CCol>
        <CCol sm="auto">
          <FechaF 
            vFcaF={vFcaF} 
            mFcaF={mFcaF}
          />
        </CCol>
        <CCol sm="auto">
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol sm="auto">
          <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
        </CCol>
      </CRow>
      <CRow className='mt-4 mb-4'>
        <DataTable
          columns={colCot}
          data={fCotizacion}
          pagination
          persistTableHead
          subHeader
        />
        <CModal 
          backdrop="static"
          visible={mPedidos}
          onClose={() => setMPedidos(false)}
          className='c-modal-80'
        >
          <CModalHeader>
            <CModalTitle>PEDIDOS</CModalTitle>
          </CModalHeader>
            <CModalBody>
                <CRow className='mt-2 mb-2'>
                  <DataTable
                    columns={colPed}
                    data={dtPedidos}
                    pagination
                    persistTableHead
                    subHeader
                  />
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CCol xs={4} md={2}>
                    <CButton color='danger' onClick={() => setMPedidos(false)} style={{'color':'white'}} > 
                        <CIcon icon={cilTrash} /> Cerrar
                    </CButton>
                </CCol>
            </CModalFooter>
        </CModal>
      <CModal
        backdrop="static"
        visible={mAcciones}
        onClose={() => setMAcciones(false)}
      >
        <CModalHeader>
          <CModalTitle>Acciones adicionales</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={12} className="mb-3">
              <CButton
                color="primary"
                className="w-100"
                onClick={() => handleRegistrarVisita(selectedCotizacion)}
              >
                Registrar visita
              </CButton>
            </CCol>

            <CCol xs={12} className="mb-3">
              <CButton
                color="success"
                className="w-100"
                onClick={() => handleRegistrarLlamada(selectedCotizacion)}
              >
                Registrar llamada
              </CButton>
            </CCol>

            <CCol xs={12}>
              <CButton
                color="info"
                className="w-100"
                onClick={handleMapeo}
              >
                Mapeo
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setMAcciones(false)}
          >
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para mostrar el MAPA con TODOS los puntos */}
      <CModal
        backdrop="static"
        visible={mapeoModal}
        onClose={() => setMapeoModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Mapa de Visitas</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <MapContainer
            center={[23.634501, -102.552784]} // Centro de México como ejemplo
            zoom={5}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
              OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {visitPoints.map((point, index) => (
              <Marker
                key={index}
                position={[point.lat, point.lng]}
              >
                <Popup>
                  <b>Visita {index + 1}</b><br/>
                  Usuario: {point.idUsuario}<br/>
                  Cotización: {point.idCotizacion}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setMapeoModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

        <CModal 
          backdrop="static"
          visible={mOpciones}
          onClose={() => setMOpciones(false)}
          className='c-modal-80'
        >
          <CModalHeader>
            <CModalTitle>Opciones</CModalTitle>
          </CModalHeader>
            <CModalBody>
              <CTabs activeItemKey={1}>
                <CTabList variant="tabs" layout="fill">
                    <CTab aria-controls="Extras" itemKey={1}>Extras</CTab>
                    <CTab aria-controls="Seguimiento" itemKey={2}>Seguimiento</CTab>
                    <CTab aria-controls="ClienteObra" itemKey={3}>Cliente</CTab>
                    <CTab aria-controls="Log" itemKey={4}>Log de Modificaciones</CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="py-3" aria-labelledby="Extras" itemKey={1}>
                      <DataTable
                        columns={colExtras}
                        data={dtExtras}
                        pagination
                        persistTableHead
                        subHeader
                      />
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="Seguimiento" itemKey={2}>
                        <CRow className='mt-2 mb-2'>
                          <CCol xs={4} md={3}>
                            <label className='mb-2'>Descripción del Seguimiento</label>
                            <CFormSelect size="sm" className="mb-3" value={dSeg} onChange={(e) => hDSeg(e)}>
                              <option value="-">-</option>
                              {cmbSeg.map((m) => (
                                <option key={m.IdAccion} value={m.IdAccion}>
                                  {m.Descripcion}
                                </option>
                              ))}
                            </CFormSelect>
                          </CCol>
                          <CCol xs={4} md={3}>
                            <FechaI 
                              vFechaI={vFechaI} 
                              cFechaI={cFechaI} 
                            />
                          </CCol>
                          <CCol xs={4} md={3}>
                            <label>Hora</label><br/>
                            <TimePicker
                              className='clockSel'
                              showSecond={false}  // Deshabilitar la selección de segundos
                              value={time}
                              onChange={handleClockCh}
                              format="HH:mm"
                              minuteStep={5}  // Configura los minutos a intervalos de 5 minutos
                            />
                          </CCol>
                          <CCol xs={4} md={3}>
                            <CButton color='primary' className='mt-2' style={{'margin-top':'3px'}}> Agregar</CButton>
                          </CCol>
                        </CRow>
                        <CRow className='mt-2 mb-2'>
                          <DataTable
                            columns={colSeg}
                            data={dtSeg}
                            pagination
                            persistTableHead
                            subHeader
                          />        
                        </CRow>
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="Log" itemKey={3}>
                      <CRow className='mt-4 mb-4'>
                        <CCol xs={2} md={2}>
                          <CFormCheck
                            type="radio"
                            name="fRT"
                            id="fR"
                            label="Cliente"
                            value="Cliente"
                            checked={chkFT === 'Cliente'}
                            onChange={hRadioCh}
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <CFormCheck
                            type="radio"
                            name="fRT"
                            id="fR1"
                            label="Obra"
                            value="Obra"
                            checked={chkFT === 'Obra'}
                            onChange={hRadioCh}
                            defaultChecked
                          />
                        </CCol>
                      </CRow>
                        {shCO && (
                        <CRow>
                          <CCol xs={6} md={4}>
                            <label>Nombre de Razón Social</label>
                            <CFormInput type="text" placeholder="Nombre de Cliente" aria-label="Nombre" value={RazonTxtC} onChange={hRazon} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>RFC</label>
                            <CFormInput type="text" placeholder="RFC" value={RFCTxtC} onChange={hRFC} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>Metodo de Pago</label>
                            <CFormInput type="text" placeholder="Metodo de Pago" value={PagoTxtC} onChange={hMPago} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>4 Últimos Dígitos Cuenta</label>
                            <CFormInput type="text" placeholder="****" value={DigitosTxtC} onChange={hDigCue} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>Dirección Fiscal</label>
                            <CFormInput type="text" placeholder="Dirección Fiscal" value={DFiscalTxtC} onChange={hDirF} />
                          </CCol>
                          <hr/>
                          <h4>DIRECCIÓN FISCAL</h4>
                          <br />
                          <CCol xs={6} md={4}>
                            <label>Calle</label>
                            <CFormInput type="text" placeholder="Calle" value={CalleTxtC} onChange={hCalleC} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>No. Exterior</label>
                            <CFormInput type="text" placeholder="No. Exterior" value={nExtTxtC} onChange={hNExtC} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>COLONIA</label>
                            <CFormInput type="text" placeholder="Colonia" value={ColTxtC} onChange={hColC}/>
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>MUNICIPIO</label>
                            <CFormInput type="text" placeholder="Municipio" value={MunTxtC} onChange={hMunC}/>
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>ESTADO</label>
                            <CFormInput type="text" placeholder="Estado" value={EdoTxtC} onChange={hEdoC} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>TELÉFONO</label>
                            <CFormInput type="text" placeholder="Telefono" value={TelTxtC} onChange={hTelC} />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>PERSONA CONTACTO</label>
                            <CFormInput type="text" placeholder="Persona Contacto" />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>CLAVE CFDI</label>
                            <CFormInput type="text" placeholder="Clave CFDI" value={CFDITxtC} onChange={hCFDI}/>
                          </CCol>
                        </CRow>
                        )}
                      {!shCO && (
                        <CRow>
                          <CCol xs={6} md={4}>
                            <label>Nombre de Obra</label>
                            <CFormInput type="text" value={nObraTxt} onChange={hNObra} placeholder="Nombre de Obra" aria-label="Nombre" />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>NÚMERO CLIENTE</label>
                            <CFormInput type="text" value={nClienteTxt} onChange={hNCliente} placeholder="NÚMERO CLIENTE" />
                          </CCol>
                          <h4>UBICACIÓN</h4>
                          <CCol xs={6} md={4}>
                            <label>DIRECCIÓN</label>
                            <CFormInput type="text" value={DirTxtO} onChange={hDirO} placeholder="DIRECCIÓN" />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>COLONIA</label>
                            <CFormInput type="text" value={ColTxtO} onChange={hColO} placeholder="COLONIA" />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>MUNICIPIO</label>
                            <CFormInput type="text" value={MunTxtO} onChange={hMunO} placeholder="MUNICIPIO" />
                          </CCol>
                          <CCol xs={6} md={4}>
                            <label>ESTADO</label>
                            <CFormInput type="text" value={EstadoTxtO} onChange={hEdoO} placeholder="ESTADO" />
                          </CCol>
                          <CCol xs={6} md={4}>

                          </CCol>
                        </CRow>
                      )}
                    </CTabPanel>
                    <CTabPanel className="py-3" aria-labelledby="Log" itemKey={4}>
                      <DataTable
                        columns={colLog}
                        data={dtLog}
                        pagination
                        persistTableHead
                        subHeader
                      />
                    </CTabPanel>
                </CTabContent>
              </CTabs>
            </CModalBody>
            <CModalFooter>
                <CCol xs={4} md={2}>
                    <CButton color='danger' onClick={() => setMOpciones(false)} style={{'color':'white'}} > 
                        <CIcon icon={cilClearAll} /> Cerrar
                    </CButton>
                </CCol>
            </CModalFooter>
        </CModal>
      </CRow>
    </CContainer>
    </>
  )
}

export default LCotizacion
