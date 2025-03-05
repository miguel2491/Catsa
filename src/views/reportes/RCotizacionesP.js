import React, {useEffect, useState, useRef} from 'react'
import '../../estilos.css';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { convertArrayOfObjectsToCSV, getPedidosCot, getArchivo, setStatus, getCotizacionExtra, getCotizacionLog, getSegmentos,
  getSeguimientos, getObraCot, getClienteCot, getCotizacionP, formatCurrency, fNumber
 } from '../../Utilidades/Funciones';
 import { format } from 'date-fns';
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
  cilCloudDownload,
  cilImage,
  cilMenu,
  cilPencil,
  cilSearch,
  cilShareAlt,
  cilTag,
  cilTrash
} from '@coreui/icons'
import BuscadorDT from '../base/parametros/BuscadorDT'
import Historial from '../logistica/Pedidos/TimeLinePedidos'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import { Rol } from '../../Utilidades/Roles'
const RCotizacionesP = () => {    
  const navigate = useNavigate();
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(new Date());
  const [vFechaF, setFechaFin] = useState(new Date());
  const [IdC, setCotId] = useState(0);
  //------------------Shows----------------------------
  const [shCO, setShCO] = useState('Cliente');
  const [mPedidos, setMPedidos] = useState(false);
  const [mOpciones, setMOpciones] = useState(false);
  //Arrays
  const [dtCotizacion, setDTCotizacion] = useState([]);
  const [dtPedidos, setDTPedidos] = useState([]);
  const [dtLog, setDTLog] = useState([]);
  const [dtSeg, setDTSeg] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  //--------------------------- Buscador --------------------------------------
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('');
  // ROLES
  const userIsAdmin = Rol('Admin');
  
  const mCambio = (event) => {
    const pla = event.target.value; 
    if(pla.length > 0)
    {
        setPlantas(pla);
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
      width:"100px",
      cell: (row) => (
        <div>
          <CRow>
            {userIsAdmin && (
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
          </CRow>
      </div>
      ),
    },{
      name: 'Planta',
      selector: row => row.Planta,
      sortable:true,
      width:"100px",
    },{
      name: '# Cotización',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"100px",
    },{
      name: 'Fecha Cotización',
      selector: row => {
        const fecha = row.FechaCreacion;
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
      name: 'Asesor Creo',
      selector: row => {
        const vendedor = row.UsuarioCreo
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
      width:"300px",
    },
    {
      name: 'Producto',
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
      sortable:true,
      width:"180px",
    },
    {
      name: 'Volumen',
      selector: row => {
        const Volumen = row.Vol
        if (Volumen === null || Volumen === undefined) {
          return "-";
        }
        if (typeof Volumen === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return Volumen;
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
    },
    {
      name: 'Precio Cotización',
      selector: row => {
          const precioCot = row.PrecioCot
          if (precioCot === null || precioCot === undefined) {
          return "No disponible";
          }
          if (typeof precioCot === 'object') {
          return "-"; // O cualquier mensaje que prefieras
          }
          return formatCurrency(precioCot);
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
    },
    {
      name: 'Total',
      selector: row => {
          const autorizo = row.PrecioCot * row.Vol;
          if (autorizo === null || autorizo === undefined) {
          return "-";
          }
          if (typeof autorizo === 'object') {
          return "-"; // O cualquier mensaje que prefieras
          }
          return formatCurrency(autorizo);
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
    },
    {
      name: 'Cantidad Pedido',
      selector: row => {
        const cantidadP = row.CantidadM3P
        if (cantidadP === null || cantidadP === undefined) {
          return "-";
        }
        if (typeof cantidadP === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return fNumber(cantidadP);
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'left', // Alineación a la derecha
      },
    },
    
    {
      name: 'Libero',
      selector: row => {
        const libera = row.Libera
        if (libera === null || libera === undefined) {
          return "No disponible";
        }
        if (typeof libera === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return libera;
      },
      sortable:true,
      width:"150px",
    },
    {
      name: 'Estatus',
      selector: row => row.Estatus,
      sortable:true,
      width:"150px",
    },
    {
      name: 'Obra',
      selector: row => {
        var nobra = row.NoObra
        if (nobra === null || nobra === undefined) {
          nobra = "-";
        }
        if (typeof nobra === 'object') {
          nobra = "-"; // O cualquier mensaje que prefieras
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
      width:"300px",
    },
    {
      name: 'Cantidad Pedido',
      selector: row => {
        var canP = row.CantidadPedido
        if (canP === null || canP === undefined) {
          canP = "-";
        }
        if (typeof canP === 'object') {
          canP = "-"; // O cualquier mensaje que prefieras
        }
        return canP;
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
    },
    {
      name: 'Cantidad Suministrada',
      selector: row => {
        var canSum = row.CantidadSumin
        if (canSum === null || canSum === undefined) {
          canSum = "-";
        }
        if (typeof canSum === 'object') {
          canSum = "-"; // O cualquier mensaje que prefieras
        }
        return fNumber(canSum);
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
    },
    {
      name: 'Diferencia',
      selector: row => {
        var canPed = row.CantidadPedido
        var canSum = row.CantidadSumin
        if (canSum === null || canSum === undefined) {
          canSum = "-";
        }
        if (typeof canSum === 'object') {
          canSum = "-"; // O cualquier mensaje que prefieras
        }
        let cantTotal = canPed - canSum;
        return fNumber(cantTotal);
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
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
  const fCotizaciones = async () =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
    const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
    try {
      // Llamada a la API
        const cotI = await getCotizacionP(auxFcaI, auxFcaF, plantasSel);
        Swal.close();
        if (cotI) {
          console.log(cotI)
          setDTCotizacion(cotI);  // Procesar la respuesta
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
  const viewPedidos = (id) =>{
    setMPedidos(true)
    if(IdC !== id){
        setCotId(id)
    }
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
            imageUrl: "https://apicatsa2.catsaconcretos.mx:2533/Uploads/DocPedidos/"+id+"/"+extFile,
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

  const downloadCSV = (e) => {
    const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
    const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(fCotizacion);
    if (csv == null) return;

    const filename = 'COTPED_'+auxFcaI+'-'+auxFcaF+'.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  };
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
          fCotizacion()
      }
  };
  const fCotizacion = dtCotizacion.filter(item => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.IdCotizacion.toString().includes(fText) || item.Cliente.toString().includes(fText) || item.NoCliente.toString().includes(fText) || item.Estatus.includes(fText) 
      || item.Obra.toString().includes(fText) || item.NoObra.toString().includes(fText) || item.UsuarioCreo.toString().includes(fText) || item.Producto.toString().includes(fText);
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
  //************************* HANDLE*************************************************************** */
  const hEdoO = (e) => {
    setEstado(e.target.value);
  };
  //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Cotizaciones Pedidos</h1>
      <CRow className='mt-3 mb-3'>
        <CCol sm="auto">
          <FechaI 
            vFechaI={vFechaI} 
            cFechaI={cFechaI} 
          /></CCol>
        <CCol sm="auto">
          <FechaF 
            vFcaF={vFechaF} 
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
            <CButton color='primary' onClick={fCotizaciones} className='mt-4'>
                <CIcon icon={cilSearch} className='mt-2' />
                    Buscar
            </CButton>
        </CCol>
        <CCol sm="auto">
          <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
        </CCol>
        <CCol sm="auto">
            <CButton color='warning' className='mt-4' onClick={downloadCSV}>
                <CIcon icon={cilCloudDownload} className='mt-2' />
                    Descargar
            </CButton>
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
            <CModalTitle>Historial</CModalTitle>
          </CModalHeader>
            <CModalBody>
                <CRow className='mt-2 mb-2'>
                  <Historial value={IdC} />
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CCol xs={4} md={2}>
                    
                </CCol>
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
              
            </CModalBody>
            <CModalFooter>
                <CCol xs={4} md={2}>
                    <CButton color='danger' style={{'color':'white'}} > 
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

export default RCotizacionesP
