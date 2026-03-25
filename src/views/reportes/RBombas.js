import React, {useEffect, useState, useRef} from 'react'
import '../../estilos.css';
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { convertArrayOfObjectsToCSV,  GetUnidades, GetUnidadBitacora, GetBombas, GetBombasD,formatCurrency, fNumber
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilCash,
  cilCheck,
  cilClearAll,
  cilCloudDownload,
  cilDelete,
  cilEyedropper,
  cilImage,
  cilSearch,
} from '@coreui/icons'
import BuscadorDT from '../base/parametros/BuscadorDT'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import { Rol } from '../../Utilidades/Roles'
import { saveAs } from "file-saver";

const RBombas = () => {    
  const navigate = useNavigate();
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(new Date());
  const [vFechaF, setFechaFin] = useState(new Date());
  const [IdU, setUnidadId] = useState(0);
  //------------------Shows----------------------------
  const [mDetalle, setMDetalle] = useState(false);
  const [mBomba, setMBomba] = useState(false);
  //Arrays
  const [aUnidades, setAUnidad] = useState([]);
  const [aDetalles, setADetalle] = useState([]);
  const [dtUnidades, setDTUnidad] = useState([]);
  const [dtDetalles, setDTDetalle] = useState([]);
  
  const [dtBombas, setDTBombas] = useState([]);
  const [dtBombasD, setDTBombasD] = useState([]);

  const [colBombas, setColBombas] = useState([]);
  const [colBombasD, setColBombasD] = useState([]);
  
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  //--------------------------- ********************** --------------------------------------
   useEffect(() => {
    getUnidades_();
   },[]);
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
  const colUnidad = [
    {
      name: 'ACCIONES',
      selector: row => row.IdCotizacion,
      width:"150px",
      cell: (row) => (
        <div>
          <CRow>
              <CCol xs={6} md={6} lg={6}>
                <CButton
                  color="primary"
                  onClick={() => viewPedidos('2',row.NoEconomico)}
                  size="sm"
                  className="me-2"
                  title="Historial Pedidos"
                >
                  <CIcon icon={cilSearch} />
                </CButton>
              </CCol>
              <CCol xs={6} md={6} lg={6}>
                <CButton
                  style={{'color':'white'}}
                  color="warning"
                  onClick={() => viewPedidos('1',row.NoEconomico)}
                  size="sm"
                  className="me-2"
                  title="Historial Ventas"
                >
                  <CIcon icon={cilCash} />
                </CButton>
              </CCol>
          </CRow>
      </div>
      ),
    },{
      name: 'Planta',
      selector: row => row.Planta,
      sortable:true,
      width:"100px",
    },{
      name: '# Económico',
      selector: row => row.NoEconomico,
      sortable:true,
      width:"150px",
    },
    {
      name: 'Descripción',
      selector: row => {
        const descr = row.Descripcion
        if (descr === null || descr === undefined) {
          return "No disponible";
        }
        if (typeof descr === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return descr;
      },
      sortable:true,
      width:"350px",
    },
    {
      name: 'Modelo',
      selector: row => {
        var modelo = row.Modelo
        if (modelo === null || modelo === undefined) {
          modelo =  "-";
        }
        if (typeof modelo === 'object') {
          modelo = "-"; // O cualquier mensaje que prefieras
        }
        
        return modelo;
      },
      sortable:true,
      width:"150px",
    },
    {
      name: 'Marca',
      selector: row => {
        const marca = row.Marca
        if (marca === null || marca === undefined) {
          return "No disponible";
        }
        if (typeof marca === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return marca;
      },
      sortable:true,
      width:"180px",
    },
    {
      name: 'Placas',
      selector: row => {
        const Placas = row.Placas
        if (Placas === null || Placas === undefined) {
          return "-";
        }
        if (typeof Placas === 'object') {
          return "-"; // O cualquier mensaje que prefieras
        }
        return Placas;
      },
      sortable:true,
      width:"150px",
      style: {
        textAlign: 'right', // Alineación a la derecha
      },
    },
  ];
  const colPedidos = [
    {
      name: 'ID Pedido',
      selector: row => row.IdPedido,
      sortable:true,
      width:"120px",
    },
    {
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
        var nobra = row.NoObra;
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
      selector: row => row.Cantidad,
      sortable:true,
      width:"100px",
    },
  ];
 
  //--------------------------------------------------------------------------------
  const getUnidades_ = async () =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    
    try {
      // Llamada a la API
        const aUnidad = await GetUnidades();//await getCotizacionP(auxFcaI, auxFcaF, plantasSel);
        Swal.close();
        if (aUnidad) {
          setAUnidad(aUnidad);
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
  const getBombas_ = async (pla) => {
    
    try {
      // Llamada a la API
      const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
      const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
      
      const aBombas = await GetBombas(auxFcaI, auxFcaF, pla);
      const aBombasD = await GetBombasD(auxFcaI, auxFcaF);
      const plantasExcluir = ["BMD1"];
      if(aBombasD[1]){
        const exclude = ["PLAYACARMEN"]; 

        // 👉 construimos las filas dinámicamente
        const filas = aBombasD[1].map(item => {
          const row = {};
          Object.keys(item).forEach(key => {
            if (!exclude.includes(key)) {
              row[key] = item[key];
            }
          });
          return row;
        });
        setDTBombasD(filas);
        const cols = Object.keys(filas[0]).map(key => ({
          name: key,
          selector: row => row[key],
          sortable: true,
        }));

        setColBombasD(cols);
      }
      if (aBombas) {
        const fila = {};
        aBombas.filter(item => !plantasExcluir.includes(item.planta)) 
        .forEach(item => {
          fila[item.planta] = item.cantidad;
        });

        // Ahora dtBombas será un array con un solo objeto plano
        setDTBombas([fila]);

        // Columnas dinámicas
        const cols = Object.keys(fila).map(key => ({
          name: key,
          selector: row => row[key],
          sortable: true,
        }));

        setColBombas(cols);
      } else {
          Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
      }
    } catch (error) {
        // Cerrar el loading y mostrar el error
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const filterUnidad = ()=>{
    const filtradas = aUnidades.filter(unidad => 
        plantasSel.includes(unidad.Planta) // o unidad.idPlanta según tu JSON
    );
    setDTUnidad(filtradas);
    getBombas_(plantasSel);
  }
  // Detalle
  const viewPedidos = async(t,id) =>{
    setMDetalle(true);
    const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
    const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
    try {
      // Llamada a la API
        const aDetalle = await GetUnidadBitacora(t,id,auxFcaI, auxFcaF, plantasSel);
        Swal.close();
        if (aDetalle) {
          setDTDetalle(aDetalle);
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
  
  const downloadCSV = (e) => {
    const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
    const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(fUnidad);
    if (csv == null) return;

    const filename = 'UNIDADES_'+auxFcaI+'-'+auxFcaF+'.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  };
  const downloadCSVBomba = (e) => {
    const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
    const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
    const filename = 'BOMBAS_'+auxFcaI+'-'+auxFcaF+'.csv';

    // 👉 convertir cada dataset a hoja
  const ws1 = XLSX.utils.json_to_sheet(dtBombas);   // primera tabla
  const ws2 = XLSX.utils.json_to_sheet(dtBombasD);  // segunda tabla

  // 👉 crear el workbook y añadir hojas
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "Bombas");
  XLSX.utils.book_append_sheet(wb, ws2, "BombasD");

  // 👉 generar el archivo
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, filename);
  };
  const downloadCSVPedido = (e) => {
    const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
    const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(dtDetalles);
    if (csv == null) return;

    const filename = 'PEDIDOSBOMBA_'+auxFcaI+'-'+auxFcaF+'.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  };
  // Buscador
  //************************************************************************************************************************************************************************** */
    // Función de búsqueda
  const onFindBusqueda = (e) => {
      setBPlanta(e.target.value);
      setFText(e.target.value);
  };
  const fBusqueda = () => {
      if(vBPlanta.length != 0){
          const valFiltrados = dtUnidades.filter(dtUnidades => 
          dtUnidades.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
          );
          setDTUnidad(valFiltrados);
      }else{
          getUnidades_();
      }
  };
  const fUnidad = dtUnidades.filter(item => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.IdRegistro.toString().includes(fText) || item.NoEconomico.toString().includes(fText.toUpperCase()) || item.Grupo.toString().includes(fText) || item.Placas.includes(fText) 
      || item.Marca.toString().includes(fText);
  });
  const fPedidos = dtDetalles.filter(item => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.IdPedido.toString().includes(fText);
  });
  //********************************************************************************************** */
  
  //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Bombas</h1>
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
            <CButton color='primary' onClick={filterUnidad} className='mt-4'>
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
        <CCol sm="auto">
            <CButton color='info' style={{'color':'white'}} className='mt-4' onClick={()=>{setMBomba(true)}}>
                <CIcon icon={cilBook} className='mt-2' />
                    Resumen Bombas
            </CButton>
        </CCol>
      </CRow>
      <CRow className='mt-4 mb-4'>
        <DataTable
          columns={colUnidad}
          data={fUnidad}
          pagination
          persistTableHead
          subHeader
        />
        <CModal 
          backdrop="static"
          visible={mDetalle}
          onClose={() => setMDetalle(false)}
          className='c-modal-80'
        >
          <CModalHeader>
            <CModalTitle>Historial</CModalTitle>
          </CModalHeader>
            <CModalBody>
                <CRow className='mt-2 mb-2'>
                  <DataTable
                    columns={colPedidos}
                    data={dtDetalles}
                    pagination
                    persistTableHead
                    subHeader
                    
                  />
                </CRow>
                <CRow>
                  <div style={{ textAlign: "left", marginTop: "10px", fontWeight: "bold" }}>
                  Total: {dtDetalles.reduce((acc, item) => acc + (item.Cantidad), 0)}
                </div>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color='warning' className='mt-4' onClick={downloadCSVPedido}>
                <CIcon icon={cilCloudDownload} className='mt-2' />
                    Descargar
              </CButton>
              <CButton color='danger' style={{'color':'white'}} className='mt-4' onClick={()=>setMDetalle(false)}>
                <CIcon icon={cilDelete} className='mt-2' />
                    Cerrar
              </CButton>
            </CModalFooter>
        </CModal>
        <CModal 
          backdrop="static"
          visible={mBomba}
          onClose={() => setMBomba(false)}
          className='c-modal-80'
        >
          <CModalHeader>
            <CModalTitle>Bombas</CModalTitle>
          </CModalHeader>
            <CModalBody>
                <CRow className='mt-2 mb-2'>
                  <DataTable
                    columns={colBombasD}
                    data={dtBombasD}
                    pagination
                    persistTableHead
                    subHeader
                  />
                </CRow>
                <CRow className='mt-2 mb-2'>
                  <DataTable
                    columns={colBombas}
                    data={dtBombas}
                    pagination
                    persistTableHead
                    subHeader
                  />
                </CRow>
            </CModalBody>
            <CModalFooter >
              <CButton color='warning' className='mt-4' onClick={downloadCSVBomba}>
                <CIcon icon={cilCloudDownload} className='mt-2' />
                    Descargar
              </CButton>
              <CButton color='danger' style={{'color':'white'}} className='mt-4' onClick={()=>setMBomba(false)}>
                <CIcon icon={cilDelete} className='mt-2' />
                    Cerrar
              </CButton>
            </CModalFooter>
        </CModal>
      </CRow>
    </CContainer>
    </>
  )
}

export default RBombas
