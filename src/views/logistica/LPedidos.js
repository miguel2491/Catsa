import React,{useEffect, useState, useRef} from 'react'
import axios from 'axios'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component'
import {getPedidosList} from '../../Utilidades/Funciones'

import {
  CContainer,
  CRow,
  CCol,
  CBadge,
  CButton
} from '@coreui/react'

import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilSearch, cilSync, cilX } from '@coreui/icons';
import { format } from 'date-fns';

const LPedidos = () => {
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const [vFcaF, setFechaFin] = useState(null);
  const [posts, setPosts] = useState([]);
  const [dtPE, setDTPE] = useState([]);
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  const [fText, setFText] = useState(''); 
  const [vBPlanta, setBPlanta] = useState('');

  useEffect(()=>{    
    if(vFechaI!=null)
      {
        if(plantasSel.length >0 && vFechaI.length > 0 && vFcaF.length > 0 && posts.length == 0)
            {
              sendGetPedidos();
            }
        }
  });
  const mCambio = (event) => {
    setPlantas(event.target.value);
    
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  
  const sendGetPedidos = async () =>{
      const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
      const auxFcaF = format(vFcaF, 'yyyy/MM/dd');
      try {
          const data = await getPedidosList(plantasSel, auxFcaI, auxFcaF);
          console.log(data);
          if (data) {
            //setShDiv(true)
            setDTPE(data);
          } else {
              Swal.fire("No se encontraron datos", "El número de cotización no es válido", "error");
          }
      } catch (error) {
          console.error(error);
          Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
      } 
  }

  const colPE = [
    {
      name: 'ACCION',
      width:"100px",
      sortable:true,
      cell: (row) => {
          
          return (
          <div>
              <CRow>
                  <CCol xs={2} md={2} lg={2}>
                  <CButton
                      style={{ color: 'white' }}
                      color="warning"
                      onClick={() => Recuperar(row.IdPedido)}
                      size="sm"
                      className="me-2"
                      title="Recuperar"
                  >
                      <CIcon icon={cilSync} />
                  </CButton>
                  </CCol>
              </CRow>
          </div>
          );
      },
    },
    {
      name: 'ID',
      sortable: true,
      width: '100px',
      selector: row => {
          const aux = row.IdPedido;
              return <CBadge color='primary' textBgColor='primary'>{aux}</CBadge>;
      },
    },
    {
      name: 'PROGRAMADO',
      sortable: true,
      width: '100px',
      selector: row => {
          const aux = row.activo;
          if (aux) {
              return <CBadge color='primary' textBgColor='primary'><CIcon icon={cilCheck}></CIcon></CBadge>;
          }else {
              return <CBadge color='danger' shape='rounded-pill'><CIcon icon={cilX}></CIcon></CBadge>;
          }
      },
    },
    {
      name: 'VB',
      sortable: true,
      width: '100px',
      selector: row => {
          const aux = row.VistoBueno;
          if (aux) {
              return <CBadge color='primary' textBgColor='primary'><CIcon icon={cilCheck}></CIcon></CBadge>;
          }else {
              return <CBadge color='danger' shape='rounded-pill'><CIcon icon={cilX}></CIcon></CBadge>;
          }
          return aux;
      },
    },
    {
      name: 'PLANTA',
      selector: (row) => row.PlantaEnvio,
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
      width: '200px',
    },
    {
      name: 'OBRA',
      selector: (row) => {
          const obra_ = row.NoObra
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
  ];

  const fPE = dtPE.filter((item) => {
    return item.PlantaEnvio.toString().includes(fText.toUpperCase()) || String(item.IdPedido).includes(fText) || String(item.Cliente).includes(fText) 
    || String(item.NoObra).includes(fText) 
  })
  
  return (
    <>
      <CContainer fluid>
        <h1>Pedidos</h1>
        <CRow>
          <CCol sm="auto">
            <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
            />
          </CCol>
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
          <CCol sm="auto" className='mt-4'>
            <CButton color='primary' onClick={sendGetPedidos}>
                <CIcon icon={cilSearch} className="me-2" />
                Realizar
            </CButton>
            </CCol>
        </CRow>
        <CRow className='mt-4'>
          <DataTable
            columns={colPE}
            data={fPE}
            pagination
            persistTableHead
            subHeader
          />
        </CRow>
      </CContainer>
    </>
  )
}

export default LPedidos
