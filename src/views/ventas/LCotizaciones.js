import React, {useEffect, useState, useRef} from 'react'
import '../../estilos.css';
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { GetCotizaciones,convertArrayOfObjectsToCSV, getPedidosCot, getArchivo } from '../../Utilidades/Funciones';
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheck,
  cilImage,
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
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  const [mPedidos, setMPedidos] = useState(false);
  //Arrays
  const [dtCotizacion, setDTCotizacion] = useState([]);
  const [dtPedidos, setDTPedidos] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  //Buscador
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
  //COLS
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
                  onClick={() => viewPDF(row.IdCotizacion)}
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
          </CRow>
      </div>
      ),
    },{
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
        console.log(cotI)
        if (cotI) {
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
      </CRow>
    </CContainer>
    </>
  )
}

export default LCotizacion
