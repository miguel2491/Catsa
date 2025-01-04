import React, {useEffect, useState, useRef} from 'react'
import classNames from 'classnames'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { GetCotizaciones,convertArrayOfObjectsToCSV } from '../../Utilidades/Funciones';
import {
  CAvatar,
  CContainer,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
} from '@coreui/icons'
//import TabulatorTest from '../base/tables/Tabulator'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'

const LCotizacion = () => {    
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [posts, setPosts] = useState([]);
  //Arrays
  const [dtCotizacion, setDTCotizacion] = useState([]);
  const [fText, setFText] = useState('');
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };

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
    setPlantas(event.target.value);
    GetCotizaciones_(event.target.value);
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
      name: 'ID',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },{
      name: 'Fecha',
      selector: row => {
        const fecha = row.Actualizo;
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
      name: 'No. Cliente',
      selector: row => row.NoCliente,
      sortable:true,
      width:"200px",
    },
    {
      name: 'Cliente',
      selector: row => row.Cliente,
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
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },
    {
      name: 'No. Obra',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },
    {
      name: 'Obra',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },
    {
      name: 'Vendedor',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },
    {
      name: 'Actualizo',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },
    {
      name: 'Autorizo',
      selector: row => row.IdCotizacion,
      sortable:true,
      width:"200px",
    },
  ];
  const fDCot = dtCotizacion.filter(item => {
    // Filtrar por planta, interfaz y texto de búsqueda
    //return item.IdCotizacion.includes(fText);
  });
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
        if (cotI && cotI.length > 0) {
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
      </CRow>
      <CRow className='mt-4 mb-4'>
        <DataTable
          columns={colCot}
          data={dtCotizacion}
          pagination
          persistTableHead
          subHeader
        />
      </CRow>
    </CContainer>
    </>
  )
}

export default LCotizacion
